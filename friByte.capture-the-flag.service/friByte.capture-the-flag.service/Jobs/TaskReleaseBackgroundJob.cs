using friByte.capture_the_flag.service.Hubs;
using friByte.capture_the_flag.service.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace friByte.capture_the_flag.service.Jobs;

public class TaskReleaseState
{
    public DateTimeOffset LastRelease;

    public TaskReleaseState(DateTimeOffset lastRelease)
    {
        this.LastRelease = lastRelease;
    }
}
public class TaskReleaseBackgroundJob:IHostedService,IDisposable
{

    private readonly ILogger<TaskReleaseBackgroundJob> _logger;
    private Timer? _timer = null;
    private readonly IServiceScopeFactory _scopeFactory;
    private IHubContext<CtfSignalrHub, ICtfSignalrHubClient> _hub;
    private DateTimeOffset _lastReleased;
    public TaskReleaseBackgroundJob(ILogger<TaskReleaseBackgroundJob> logger, IServiceScopeFactory scopeFactory, IHubContext<CtfSignalrHub, ICtfSignalrHubClient> hub)
    {
        _logger = logger;
        _scopeFactory = scopeFactory;
        _hub = hub;
        _lastReleased = DateTimeOffset.UtcNow;
    }

    public Task StartAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Task Release Background Job is running.");
        _timer = new Timer(DoWork, null, TimeSpan.FromSeconds(65-DateTime.UtcNow.Second),
            TimeSpan.FromMinutes(1));
        return Task.CompletedTask;
    }

    private void DoWork(object? obj)
    {
        var timeNow = DateTimeOffset.UtcNow;
        CheckTaskReleaseAsync(timeNow);
    }

    private async void CheckTaskReleaseAsync(DateTimeOffset timeNow)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            var _ctx = scope.ServiceProvider.GetRequiredService<CtfContext>();
            var isNewTasks = await _ctx.CtfTasks
                .AnyAsync(a => a.ReleaseDateTime >= _lastReleased && a.ReleaseDateTime <= timeNow);
            _lastReleased = timeNow;
            if (isNewTasks)
            {
                _logger.LogInformation("Signaling that new tasks have been released");
                await _hub.Clients.All.SignalNewTaskRelease();
            }
        }
    }

    public Task StopAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Task Release Background Job is stopping");

        _timer?.Change(Timeout.Infinite, 0);

        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _timer?.Dispose();
    }
}