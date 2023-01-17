using friByte.capture_the_flag.service.Models;
using friByte.capture_the_flag.service.Services;
using friByte.capture_the_flag.service.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace friByte.capture_the_flag.service.Controllers;

/// <summary>
/// API endpoints for managing tasks. The management endpoints should be restricted to Admin
/// List tasks can probably be open for all.
/// </summary>
[Authorize(Roles = $"{IdentityRoleNames.TeamRoleName}, {IdentityRoleNames.AdminRoleName}")]
[ApiController]
[Produces("application/json")]
[Route("Api/[controller]")]
public class 
    TaskController : ControllerBase {

    private readonly ILogger<TaskController> _logger;
    private readonly ICtfTaskService _ctfTaskService;

    public TaskController(ILogger<TaskController> logger, ICtfTaskService ctfTaskService)
    {
        _logger = logger;
        _ctfTaskService = ctfTaskService;
    }

    /// <summary>
    /// Get all tasks in database, currently even the flag is returned
    /// </summary>
    /// <returns></returns>
    [HttpGet(Name = "task")]
    public Task<List<CtfTask>> Get()
    {
        return _ctfTaskService.GetAllAsync();
    }
}