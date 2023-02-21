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
public class TaskController : ControllerBase {

    private readonly ILogger<TaskController> _logger;
    private readonly ICtfTaskService _ctfTaskService;

    public TaskController(ILogger<TaskController> logger, ICtfTaskService ctfTaskService)
    {
        _logger = logger;
        _ctfTaskService = ctfTaskService;
    }

    /// <summary>
    /// Get all tasks in database
    /// </summary>
    [HttpGet(Name = "task")]
    public async Task<List<CtfTaskReadModel>> Get()
    {
        var tasks = await _ctfTaskService.GetAllAsync();

        return tasks.Select(t => new CtfTaskReadModel(t)).ToList();
    }

    /// <summary>
    /// Try to solve a task, returned response will indicate whether or not the flag was correct
    /// </summary>
    [HttpPost("/solve/{id:Guid}", Name = "Solve")]
    public async Task<IActionResult> Solve(Guid id, [FromBody] SolveTaskRequest solveTaskRequest)
    {
        var teamId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier); // Should return the id of the current logged in user
        if (teamId == null)
        {
            return Unauthorized();
        }
        var success = await _ctfTaskService.AttemptToSolveAsync(teamId, id, solveTaskRequest.Flag);

        return Ok(
        new {
            success,
        });
    }
}

public class SolveTaskRequest
{
    public string Flag { get; set; }
}