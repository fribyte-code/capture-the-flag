using friByte.capture_the_flag.service.Models;
using friByte.capture_the_flag.service.Services;
using Microsoft.AspNetCore.Mvc;

namespace friByte.capture_the_flag.service.Controllers;

[ApiController]
[Route("[controller]")]
public class 
    TaskController : ControllerBase {

    private readonly ILogger<TaskController> _logger;
    private readonly ICtfTaskService _ctfTaskService;

    public TaskController(ILogger<TaskController> logger, ICtfTaskService ctfTaskService)
    {
        _logger = logger;
        _ctfTaskService = ctfTaskService;
    }

    [HttpGet(Name = "task")]
    public Task<List<CtfTask>> Get()
    {
        return _ctfTaskService.GetAllAsync();
    }
}