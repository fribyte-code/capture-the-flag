using friByte.capture_the_flag.service.Models;
using friByte.capture_the_flag.service.Models.Api;
using friByte.capture_the_flag.service.Services.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace friByte.capture_the_flag.service.Services;

/// <summary>
/// Service for generating a leaderboard, should probably add a cache to this service
/// </summary>
public interface ICtfLeaderboardService
{
    Task<List<LeaderboardEntry>> GetLeaderboard();
    Task<LeaderboardEntry> GetScoreForTeamId(string teamId);
}

public class CtfLeaderboardService : ICtfLeaderboardService
{
    private readonly CtfContext _ctfContext;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<CtfLeaderboardService> _logger;

    public CtfLeaderboardService(
        CtfContext ctfContext,
        ILogger<CtfLeaderboardService> logger,
        UserManager<ApplicationUser> userManager)
    {
        _ctfContext = ctfContext;
        _logger = logger;
        _userManager = userManager;
    }

    public async Task<List<LeaderboardEntry>> GetLeaderboard()
    {
        var leaderboard = await _ctfContext.SolvedTasks
            .GroupBy(t => t.TeamId)
            .Select(g => new LeaderboardEntry(g.Key, g.Sum(t => t.Task.Points)))
            .ToListAsync();

        var adminUserIds = (await _userManager.GetUsersInRoleAsync(IdentityRoleNames.AdminRoleName)).Select(u => u.Id);

        var filteredLeaderboard = leaderboard.Where(e => adminUserIds.Contains(e.TeamId));
        
        // It was not possible to run OrderByDescending directly after the .Select statement as it changes the model or something like that...
        // So we need to sort the list in memory instead of in the database
        return filteredLeaderboard.OrderByDescending(e => e.Points)
            .ToList();
    }

    public async Task<LeaderboardEntry> GetScoreForTeamId(string teamId)
    {
        var teamScore = await _ctfContext.SolvedTasks
            .Where(t => t.TeamId == teamId)
            .SumAsync(t => t.Task.Points);
        return new LeaderboardEntry(teamId, teamScore);
    }
}

public class LeaderboardEntry
{
    public LeaderboardEntry(string teamId, int points)
    {
        TeamId = teamId;
        Points = points;
    }

    public string TeamId { get; }
    public int Points { get; }
}