using friByte.capture_the_flag.service.Models;
using friByte.capture_the_flag.service.Models.Api;
using Microsoft.EntityFrameworkCore;
using System.Runtime.Serialization;
using friByte.capture_the_flag.service.Hubs;
using friByte.capture_the_flag.service.Services.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

namespace friByte.capture_the_flag.service.Services;

/// <summary>
/// Service for fetching the actual Capture the flag tasks from the database.
/// Having a dedicated service for these operations is good practice to:
/// - simplify controller
/// - simplify unit testing
/// - and have one source of truth when fetching tasks other places in the codebase.
/// </summary>
public interface ICtfTaskService
{
    public Task<List<CtfTask>> GetAllAsync();
    public Task<CtfTask> AddAsync(CtfTaskWriteModel newTask);
    public Task<CtfTask> UpdateAsync(Guid id, CtfTaskWriteModel updatedTask);
    public Task DeleteAsync(Guid id);
    public Task<bool> AttemptToSolveAsync(string teamName, Guid taskId, string flag);
    /// <returns>A list of all "solved flag"-events</returns>
    public Task<List<SolvedTaskReadModel>> GetSolveHistoryAsync();

    /// <summary>
    /// Returns the same list of tasks as <see cref="GetSolveHistoryAsync"/>
    /// But mapped to the readModel including whether or not the task is solved or not.
    /// </summary>
    Task<List<CtfTaskReadModel>> GetAllReleasedTasksIncludingIsSolvedOrNot(string teamName);
}

public class CtfTaskService : ICtfTaskService
{
    private readonly CtfContext _ctfContext;
    private readonly ILogger<CtfTaskService> _logger;
    private readonly IBruteforceCheckerService _bruteforceCheckerService;
    private readonly IHubContext<CtfSignalrHub, ICtfSignalrHubClient> _ctfSignalrHubContext;
    private readonly ICtfLeaderboardService _ctfLeaderboardService;
    private readonly UserManager<ApplicationUser> _userManager;

    public CtfTaskService(
        CtfContext ctfContext,
        ILogger<CtfTaskService> logger,
        IBruteforceCheckerService bruteforceCheckerService,
        IHubContext<CtfSignalrHub, ICtfSignalrHubClient> ctfSignalrHubContext,
        ICtfLeaderboardService ctfLeaderboardService,
        UserManager<ApplicationUser> userManager)
    {
        _ctfContext = ctfContext;
        _logger = logger;
        _bruteforceCheckerService = bruteforceCheckerService;
        _ctfSignalrHubContext = ctfSignalrHubContext;
        _ctfLeaderboardService = ctfLeaderboardService;
        _userManager = userManager;
    }

    public Task<List<CtfTask>> GetAllAsync()
    {
        return _ctfContext.CtfTasks.OrderBy(t => t.CreatedAt).ToListAsync();
    }

    public Task<List<CtfTaskReadModel>> GetAllReleasedTasksIncludingIsSolvedOrNot(string teamName)
    {
        return _ctfContext.CtfTasks
            .Where(t => t.ReleaseDateTime == null || t.ReleaseDateTime < DateTimeOffset.UtcNow)
            .Select(t => new CtfTaskReadModel()
            {
                Id = t.Id,
                Name = t.Name,
                Points = t.Points,
                Description = t.Description,
                IsSolved = t.SuccessfullSolveAttempts.Any(st => st.TeamId == teamName),
                ReleaseDateTime = t.ReleaseDateTime,
                Category = t.Category
            })
            .OrderBy(t => t.Name)
            .ToListAsync();
    }

    public async Task<CtfTask> AddAsync(CtfTaskWriteModel newTask)
    {
        var newDbEntity = new CtfTask(
            newTask.Name,
            newTask.Flag,
            newTask.Points,
            newTask.Description,
            newTask.ReleaseDateTime,
            newTask.Category
        );
        await _ctfContext.CtfTasks.AddAsync(newDbEntity);
        await _ctfContext.SaveChangesAsync();

        return newDbEntity;
    }

    public async Task<CtfTask> UpdateAsync(Guid id, CtfTaskWriteModel updatedTask)
    {
        var existingTask = await _ctfContext.CtfTasks.FindAsync(id);
        if (existingTask == null)
        {
            throw new ArgumentException("Could not find task");
        }

        existingTask.Name = updatedTask.Name;
        existingTask.Flag = updatedTask.Flag;
        existingTask.Points = updatedTask.Points;
        existingTask.Description = updatedTask.Description;
        existingTask.ReleaseDateTime = updatedTask.ReleaseDateTime;
        existingTask.Category = updatedTask.Category;

        await _ctfContext.SaveChangesAsync();

        return existingTask;
    }

    public async Task DeleteAsync(Guid id)
    {
        var existingTask = await _ctfContext.CtfTasks.FindAsync(id);
        if (existingTask == null)
        {
            return;
        }
        _ctfContext.Remove(existingTask);
        await _ctfContext.SaveChangesAsync();
    }

    /// <summary>
    /// Attempt to solve a task
    /// </summary>
    /// <returns>True if solved, false if not solved</returns>
    /// <exception cref="ArgumentException">If task is not found</exception>
    public async Task<bool> AttemptToSolveAsync(string teamName, Guid taskId, string flag)
    {
        var task = await _ctfContext.CtfTasks.FindAsync(taskId);
        if (task == null)
        {
            throw new ArgumentException($"AttemptToSolve: Could not find task with taskId: {taskId}", nameof(taskId));
        }

        var alreadySolved = await _ctfContext.SolvedTasks.Where(st => st.TeamId == teamName && st.Task.Id == taskId).AnyAsync();
        if (alreadySolved)
        {
            // Team has already solved this task
            return true;
        }

        if (_bruteforceCheckerService.IsWithinBruteforceTimeout(teamName, taskId))
        {
            // Maybe send an event to frontend clients with bruteforce attempts as well?
            throw new BruteForceException();
        }

        if (string.Equals(task.Flag, flag, StringComparison.CurrentCultureIgnoreCase))
        {
            // Correct answer
            _logger.LogInformation("Team {TeamName} solved task: {TaskName} and received {Points} points", teamName, task.Name,
                task.Points);
            var solvedTask = new SolvedTask(teamName, task);
            _ctfContext.SolvedTasks.Add(solvedTask);
            await _ctfContext.SaveChangesAsync();

            // Notify all clients of the newly solved task
            await SendSolvedTaskEventToClients(solvedTask);

            return true;
        }

        // Wrong answer
        _logger.LogInformation("Team {TeamName} failed to solve task: {TaskName}", teamName,
            task.Name);
        // Maybe send an event to frontend clients with failed attempt as well?
        return false;
    }

    public Task<List<SolvedTaskReadModel>> GetSolveHistoryAsync()
    {
        return _ctfContext.SolvedTasks
            .Include(t => t.Task)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new SolvedTaskReadModel(t))
            .ToListAsync();
    }

    /// <summary>
    /// Sends live signalR events to frontend to let the scoreboard update live without page refresh
    /// </summary>
    private async Task SendSolvedTaskEventToClients(SolvedTask solvedTask)
    {
        var adminIds = (await _userManager.GetUsersInRoleAsync(IdentityRoleNames.AdminRoleName)).Select(u => u.UserName);
        if (adminIds.Contains(solvedTask.TeamId))
        {
            return;
        }

        // Runs both calls in parallel
        await Task.WhenAll(
            _ctfSignalrHubContext.Clients.All.ReceiveSolvedTask(new SolvedTaskReadModel(solvedTask)),
            _ctfSignalrHubContext.Clients.All.ReceiveLeaderboardEntryChange(
                _ctfLeaderboardService.GetScoreForTeamId(solvedTask.TeamId).Result)
        );
    }
}

[Serializable]
internal class BruteForceException : Exception
{
    public BruteForceException() { }

    public BruteForceException(string? message) : base(message) { }
}