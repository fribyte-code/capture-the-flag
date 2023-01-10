using friByte.capture_the_flag.service.Models;
using Microsoft.EntityFrameworkCore;

namespace friByte.capture_the_flag.service.Services;

/// <summary>
/// Service for fetching the actual Capture the flag tasks from the database.
/// Having a dedicated service for these operations is good practice to:
/// simplify controller
/// simplify unit testing
/// and have one source of truth when fetching tasks other places in the code.
/// </summary>
public interface ICtfTaskService
{
    public Task<List<CtfTask>> GetAllAsync();
}

public class CtfTaskService : ICtfTaskService
{
    private readonly CtfContext _ctfContext;

    public CtfTaskService(CtfContext ctfContext)
    {
        _ctfContext = ctfContext;
    }

    public Task<List<CtfTask>> GetAllAsync()
    {
        return _ctfContext.CtfTasks.ToListAsync();
    }
}