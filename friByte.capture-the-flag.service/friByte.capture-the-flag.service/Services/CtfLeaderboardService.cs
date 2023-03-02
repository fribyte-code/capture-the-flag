using friByte.capture_the_flag.service.Models;
using friByte.capture_the_flag.service.Models.Api;
using Microsoft.EntityFrameworkCore;

namespace friByte.capture_the_flag.service.Services;

/// <summary>
/// Service for generating a leaderboard, should probably add a cache to this service
/// </summary>
public interface ICtfLeaderboardService
{
    public Task<List<LeaderboardEntry>> GetLeaderboard();
}

public class CtfLeaderboardService : ICtfLeaderboardService
{
    private readonly CtfContext _ctfContext;
    private readonly ILogger<CtfLeaderboardService> _logger;

    public CtfLeaderboardService(CtfContext ctfContext, ILogger<CtfLeaderboardService> logger)
    {
        _ctfContext = ctfContext;
        _logger = logger;
    }

    public Task<List<LeaderboardEntry>> GetLeaderboard()
    {
        return _ctfContext.SolvedTasks
            .GroupBy(t => t.TeamId)
            .Select(g => new LeaderboardEntry(g.Key, g.Sum(t => t.Task.Points)))
            .ToListAsync();
    }
}

public class LeaderboardEntry
{
    public LeaderboardEntry(string teamId, int points)
    {
        TeamId = teamId;
        Points = points;
    }

    public string TeamId { get; set; }
    public int Points { get; set; }
}