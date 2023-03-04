using FluentAssertions;
using friByte.capture_the_flag.service.Hubs;
using friByte.capture_the_flag.service.Models;
using friByte.capture_the_flag.service.Models.Api;
using friByte.capture_the_flag.service.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace friByte.capture_the_flag.tests;

[TestClass]
public class CtfLeaderboardServiceTests
{
    private const string TeamA = "teamA";
    private const string TeamB = "teamB";
    
    private static CtfContext GetContext()
    {
        var options = DbTestHelper.GetDbContextOptionsBuilder();
        return new CtfContext(options);
    }

    private static ICtfLeaderboardService GetService()
    {
        return new CtfLeaderboardService(GetContext(), new Mock<ILogger<CtfLeaderboardService>>().Object);
    }

    private static ICtfTaskService GetCtfTaskService()
    {
        return new CtfTaskService(
            GetContext(),
            new Mock<ILogger<CtfTaskService>>().Object,
            new Mock<IBruteforceCheckerService>().Object,
            new Mock<IHubContext<CtfSignalrHub, ICtfSignalrHubClient>>().Object,
            new Mock<ICtfLeaderboardService>().Object
        );
    }

    [TestInitialize]
    public async Task Setup()
    {
        //Cleanup the database prior to each test
        var dbContext = GetContext();
        await DbCleaner.CleanDatabase(dbContext);
    }

    [TestMethod]
    public async Task GetLeaderBoard_EmptyCtfTaskList_ReturnsEmptyLeaderBoard()
    {
        var leaderboard = await GetService().GetLeaderboard();
        leaderboard.Should().BeEquivalentTo(new List<LeaderboardEntry>());

    }

    [TestMethod]
    public async Task GetLeaderBoard_CorrectlySummarizePoints()
    {
        await SolveTasks();
        
        // Verify leaderboard
        var leaderboard = await GetService().GetLeaderboard();
        leaderboard.Should().BeEquivalentTo(new List<LeaderboardEntry>()
        {
            new LeaderboardEntry(points: 17, teamId: TeamA),
            new LeaderboardEntry(points: 10, teamId: TeamB),
        });
    }

    [TestMethod]
    public async Task GetScoreForTeamId_CorrectlySummarizePoints()
    {
        await SolveTasks();

        // Verify leaderboard
        var teamAScore = await GetService().GetScoreForTeamId(TeamB);
        teamAScore.Should().BeEquivalentTo(new LeaderboardEntry(points: 17, teamId: TeamA));
        
        var teamBScore = await GetService().GetScoreForTeamId(TeamB);
        teamBScore.Should().BeEquivalentTo(new LeaderboardEntry(points: 10, teamId: TeamB));
    }

    private static async Task SolveTasks()
    {
        // Populate database
        var ctfTaskService = GetCtfTaskService();
        var taskA = await ctfTaskService.AddAsync(new CtfTaskWriteModel()
        {
            Description = "TaskA",
            Flag = "flagA",
            Points = 10,
            Name = "TaskA",
        });
        var taskB = await ctfTaskService.AddAsync(new CtfTaskWriteModel()
        {
            Description = "TaskB",
            Flag = "flagB",
            Points = 2,
            Name = "TaskB",
        });
        var taskC = await ctfTaskService.AddAsync(new CtfTaskWriteModel()
        {
            Description = "TaskC",
            Flag = "flagC",
            Points = 5,
            Name = "TaskC",
        });

        await ctfTaskService.AttemptToSolveAsync(TeamA, taskA.Id, taskA.Flag);
        await ctfTaskService.AttemptToSolveAsync(TeamA, taskB.Id, taskB.Flag);
        await ctfTaskService.AttemptToSolveAsync(TeamA, taskC.Id, taskC.Flag);
        await ctfTaskService.AttemptToSolveAsync(TeamB, taskA.Id, taskA.Flag);
    }
}