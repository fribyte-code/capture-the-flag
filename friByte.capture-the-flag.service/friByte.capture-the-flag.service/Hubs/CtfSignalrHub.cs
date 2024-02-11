using friByte.capture_the_flag.service.Models.Api;
using friByte.capture_the_flag.service.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace friByte.capture_the_flag.service.Hubs;

/// <summary>
/// A hub is a SignalR Websocket connection point
/// It enables sending live messages to all subscribed clients
/// This removes the need to refresh the scoreboard every x minute
/// <br/>
/// We can limit this hub to only authorized users by adding `[Autorize]`
/// </summary>
public class CtfSignalrHub : Hub<ICtfSignalrHubClient>
{
    private readonly ILogger<CtfSignalrHub> _logger;

    public CtfSignalrHub(ILogger<CtfSignalrHub> logger)
    {
        _logger = logger;
    }

    public Task SendLeaderboardEntry(LeaderboardEntry leaderboardEntry) =>
        Clients.All.ReceiveLeaderboardEntryChange(leaderboardEntry);

    public Task SendSolvedTask(SolvedTaskReadModel solvedTask) =>
        Clients.All.ReceiveSolvedTask(solvedTask);
    
    public override async Task OnConnectedAsync()
    {
        _logger.LogInformation("SignalR hub connect: {ConnectionId}", Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation("SignalR hub disconnect:  {ConnectionId}", Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }
}

/// <summary>
/// This interface describes all events the frontend clients could listen for.
/// https://learn.microsoft.com/en-us/aspnet/core/signalr/hubs?view=aspnetcore-7.0#strongly-typed-hubs
/// </summary>
public interface ICtfSignalrHubClient
{
    /// <summary>
    /// Sent everytime some team solves a task and their score changes
    /// </summary>
    /// <param name="leaderboardEntry"></param>
    /// <returns></returns>
    Task ReceiveLeaderboardEntryChange(LeaderboardEntry leaderboardEntry);
    /// <summary>
    /// Triggered everytime some team solves a task
    /// Could be used in an admin panel to show activity
    /// Or as a toaster perhaps to stress out the teams.
    /// </summary>
    /// <param name="solvedTask"></param>
    /// <returns></returns>
    Task ReceiveSolvedTask(SolvedTaskReadModel solvedTask);
    
    /// <summary>
    /// Triggers when the time of one or more new tasks to release
    /// </summary>
    /// <returns></returns>
    Task SignalNewTaskRelease();
}