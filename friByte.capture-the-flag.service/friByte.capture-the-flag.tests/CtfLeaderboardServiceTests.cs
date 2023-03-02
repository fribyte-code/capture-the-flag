using FluentAssertions;
using friByte.capture_the_flag.service.Models;
using friByte.capture_the_flag.service.Models.Api;
using friByte.capture_the_flag.service.Services;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace friByte.capture_the_flag.tests;

[TestClass]
public class CtfLeaderboardServiceTests
{
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
        return new CtfTaskService(GetContext(), new Mock<ILogger<CtfTaskService>>().Object, new Mock<IBruteforceCheckerService>().Object);
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

        const string teamA = "teamA";
        const string teamB = "teamB";
        await ctfTaskService.AttemptToSolveAsync(teamA, taskA.Id, taskA.Flag);
        await ctfTaskService.AttemptToSolveAsync(teamA, taskB.Id, taskB.Flag);
        await ctfTaskService.AttemptToSolveAsync(teamA, taskC.Id, taskC.Flag);
        await ctfTaskService.AttemptToSolveAsync(teamB, taskA.Id, taskA.Flag);
        
        // Verify leaderboard
        var leaderboard = await GetService().GetLeaderboard();

        leaderboard.Should().BeEquivalentTo(new List<LeaderboardEntry>()
        {
            new LeaderboardEntry(points: 17, teamId: teamA),
            new LeaderboardEntry(points: 10, teamId: teamB),
        });
    }
}