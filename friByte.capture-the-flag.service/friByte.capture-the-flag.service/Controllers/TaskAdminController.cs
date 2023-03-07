using friByte.capture_the_flag.service.Models;
using friByte.capture_the_flag.service.Models.Api;
using friByte.capture_the_flag.service.Services;
using friByte.capture_the_flag.service.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace friByte.capture_the_flag.service.Controllers;

/// <summary>
/// API endpoints for managing tasks. The management endpoints should be restricted to Admin.
/// </summary>
[Authorize(Roles = $"{IdentityRoleNames.AdminRoleName}")]
[ApiController]
[Produces("application/json")]
[Route("Api/[controller]")]
public class TaskAdminController : ControllerBase {

    private readonly ILogger<TaskAdminController> _logger;
    private readonly ICtfTaskService _ctfTaskService;

    public TaskAdminController(ILogger<TaskAdminController> logger, ICtfTaskService ctfTaskService)
    {
        _logger = logger;
        _ctfTaskService = ctfTaskService;
    }

    /// <summary>
    /// Get all tasks in database
    /// </summary>
    [HttpGet("", Name = "AdminAllTasks")]
    public async Task<List<CtfTask>> Get()
    {
        return await _ctfTaskService.GetAllAsync();
    }

    /// <summary>
    /// Add new task
    /// </summary>
    [HttpPost("", Name = "AdminAddTask")]
    public async Task<CtfTask> Post(CtfTaskWriteModel updatedTask)
    {
        var updatedDbTask = await _ctfTaskService.AddAsync(updatedTask);
        return updatedDbTask;
    }

    /// <summary>
    /// Update existing task
    /// </summary>
    [HttpPut("{id:Guid}", Name = "AdminUpdateTask")]
    public async Task<CtfTask> Put(Guid id, CtfTaskWriteModel updatedTask)
    {
        var updatedDbTask = await _ctfTaskService.UpdateAsync(id, updatedTask);
        return updatedDbTask;
    }

    /// <summary>
    /// Delete existing task
    /// </summary>
    [HttpDelete("{id:Guid}", Name = "AdminDeleteTask")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _ctfTaskService.DeleteAsync(id);
        _logger.LogInformation("Deleted task: {Id}", id);
        return NoContent();
    }
}