using System.Security.Claims;
using friByte.capture_the_flag.service.Models.Api;
using friByte.capture_the_flag.service.Services;
using friByte.capture_the_flag.service.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace friByte.capture_the_flag.service.Controllers;

/// <summary>
/// API endpoints for serving tasks. Open to all logged in users.
/// </summary>
[Authorize(Roles = $"{IdentityRoleNames.TeamRoleName}, {IdentityRoleNames.AdminRoleName}")]
[ApiController]
[Produces("application/json")]
[Route("Api/[controller]")]
public class TasksController : ControllerBase {

    private readonly ILogger<TasksController> _logger;
    private readonly ICtfTaskService _ctfTaskService;

    public TasksController(ILogger<TasksController> logger, ICtfTaskService ctfTaskService)
    {
        _logger = logger;
        _ctfTaskService = ctfTaskService;
    }

    /// <summary>
    /// Get all tasks in database
    /// </summary>
    [HttpGet(Name = "Tasks")]
    public async Task<List<CtfTaskReadModel>> Get()
    {
        var tasks = await _ctfTaskService.GetAllAsync();

        return tasks.Select(t => new CtfTaskReadModel(t)).ToList();
    }

    /// <summary>
    /// Try to solve a task, returned response will indicate whether or not the flag was correct
    /// </summary>
    [HttpPost("solve/{id:Guid}", Name = "Solve")]
    public async Task<ActionResult<SolveTaskResponse>> Solve(Guid id, [FromBody] SolveTaskRequest solveTaskRequest)
    {
        var teamName = HttpContext.User.FindFirstValue(ClaimTypes.Name);
        if (teamName == null)
        {
            return Unauthorized();
        }

        try
        {
            var success = await _ctfTaskService.AttemptToSolveAsync(teamName, id, solveTaskRequest.Flag);

            return Ok(new SolveTaskResponse { Success = success, });
        }
        catch (BruteForceException )
        {
            _logger.LogInformation("Bruteforce detected from team {TeamName}", HttpContext.User.FindFirstValue(ClaimTypes.Name));
            return Ok(new SolveTaskResponse { Success = false, IsBruteForceDetected = true, });
        }
    }

    /// <returns>
    /// <inheritdoc cref="ICtfTaskService.GetSolveHistoryAsync"/>
    /// </returns>
    [HttpGet("solve/history", Name = "SolveHistory")]
    public Task<List<SolvedTaskReadModel>> GetSolveHistoryAsync()
    {
        return _ctfTaskService.GetSolveHistoryAsync();
    }
}

public class SolveTaskRequest
{
    public string Flag { get; set; } = null!;
}

public class SolveTaskResponse
{
    public bool Success { get; set; }
    public bool IsBruteForceDetected { get; set; } = false;
}