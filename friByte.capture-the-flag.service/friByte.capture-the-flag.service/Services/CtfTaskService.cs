using friByte.capture_the_flag.service.Models;
using friByte.capture_the_flag.service.Models.Api;
using Microsoft.EntityFrameworkCore;

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
    public Task<bool> AttemptToSolveAsync(string teamId, Guid taskId, string flag);
}

public class CtfTaskService : ICtfTaskService
{
    private readonly CtfContext _ctfContext;
    private readonly ILogger<CtfTaskService> _logger;

    public CtfTaskService(CtfContext ctfContext, ILogger<CtfTaskService> logger)
    {
        _ctfContext = ctfContext;
        _logger = logger;
    }

    public Task<List<CtfTask>> GetAllAsync()
    {
        return _ctfContext.CtfTasks.OrderBy(t => t.CreatedAt).ToListAsync();
    }

    public async Task<CtfTask> AddAsync(CtfTaskWriteModel newTask)
    {
        var newDbEntity = new CtfTask(newTask.Name, newTask.Flag, newTask.Points, newTask.Description);
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
    public async Task<bool> AttemptToSolveAsync(string teamId, Guid taskId, string flag)
    {
        var task = await _ctfContext.CtfTasks.FindAsync(taskId);
        if (task == null)
        {
            throw new ArgumentException($"AttemptToSolve: Could not find task with taskId: {taskId}", nameof(taskId));
        }

        var alreadySolved = await _ctfContext.SolvedTasks.Where(st => st.TeamId == teamId && st.Task.Id == taskId).AnyAsync();
        if (alreadySolved)
        {
            // Team has already solved this task
            return true;
        }
        
        if (task.Flag == flag)
        {
            // Correct answer
            _logger.LogInformation("Team {TeamName} solved task: {TaskName} and received {Points} points", teamId, task.Name,
                task.Points);
            _ctfContext.SolvedTasks.Add(new SolvedTask(teamId, task));
            await _ctfContext.SaveChangesAsync();
            return true;
        }

        // Wrong answer
        _logger.LogInformation("Team {TeamName} failed to solve task: {TaskName}", teamId,
            task.Name);
        return false;
    }
}