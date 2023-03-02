using friByte.capture_the_flag.service.Services;
using friByte.capture_the_flag.service.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace friByte.capture_the_flag.service.Controllers;

/// <summary>
/// API endpoints for serving leaderboard
/// </summary>
[Authorize(Roles = $"{IdentityRoleNames.TeamRoleName}, {IdentityRoleNames.AdminRoleName}")]
[ApiController]
[Produces("application/json")]
[Route("Api/[controller]")]
public class LeaderboardController : ControllerBase {

    private readonly ILogger<LeaderboardController> _logger;
    private readonly ICtfLeaderboardService _ctfLeaderboardService;

    public LeaderboardController(ILogger<LeaderboardController> logger, ICtfLeaderboardService ctfLeaderboardService)
    {
        _logger = logger;
        _ctfLeaderboardService = ctfLeaderboardService;
    }

    /// <summary>
    /// Get leaderboard
    /// </summary>
    [HttpGet(Name = "Leaderboard")]
    public Task<List<LeaderboardEntry>> Get()
    {
        return _ctfLeaderboardService.GetLeaderboard();
    }
}