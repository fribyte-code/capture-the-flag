using FluentAssertions;
using friByte.capture_the_flag.service.Models;
using friByte.capture_the_flag.service.Models.Api;
using friByte.capture_the_flag.service.Services;
using Microsoft.Extensions.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace friByte.capture_the_flag.tests;

[TestClass]
public class BruteforceCheckerServiceTests
{
    private readonly Mock<ISystemClock> _systemClockMock = new Mock<ISystemClock>();
    private IBruteforceCheckerService GetService()
    {
        return new BruteforceCheckerService(_systemClockMock.Object);
    }

    [TestInitialize]
    public void Init()
    {
        _systemClockMock.SetupGet(c => c.UtcNow).Returns(DateTimeOffset.UtcNow);
    }

    [TestMethod]
    public void IsWithinBruteforceTimeout_emptyDatabase_returnFalse()
    {
        var service = GetService();

        service.IsWithinBruteforceTimeout("Root", Guid.NewGuid()).Should().BeFalse();
    }

    [TestMethod]
    public void IsWithinBruteforceTimeout_alreadyAttempted_returnTrue()
    {
        var service = GetService();
        var guid = Guid.NewGuid();

        service.IsWithinBruteforceTimeout("Root", guid).Should().BeFalse();
        service.IsWithinBruteforceTimeout("Root", guid).Should().BeTrue();
    }

    [TestMethod]
    public void IsWithinBruteforceTimeout_twoTeamsPassSameTask_returnFalse()
    {
        var service = GetService();
        var guid = Guid.NewGuid();

        service.IsWithinBruteforceTimeout("Root", guid).Should().BeFalse();
        service.IsWithinBruteforceTimeout("Echo", guid).Should().BeFalse();
    }


    [TestMethod]
    public void IsWithinBruteforceTimeout_alreadyAttempted_TimeoutPassed_returnFalse()
    {
        var service = GetService();
        var guid = Guid.NewGuid();

        service.IsWithinBruteforceTimeout("Root", guid).Should().BeFalse();
        service.IsWithinBruteforceTimeout("Root", guid).Should().BeTrue();

        _systemClockMock.SetupGet(c => c.UtcNow).Returns(DateTimeOffset.UtcNow + TimeSpan.FromMinutes(1));
        service.IsWithinBruteforceTimeout("Root", guid).Should().BeFalse();
    }

    [TestMethod]
    public void IsWithinBruteforceTimeout_MultipleAttemptWithinTimeout_DoesNotResetTimeout()
    {
        var service = GetService();
        var guid = Guid.NewGuid();
        var now = DateTimeOffset.UtcNow;
        _systemClockMock.SetupGet(c => c.UtcNow).Returns(now);

        service.IsWithinBruteforceTimeout("Root", guid).Should().BeFalse();
        _systemClockMock.SetupGet(c => c.UtcNow).Returns(now + TimeSpan.FromSeconds(20));
        service.IsWithinBruteforceTimeout("Root", guid).Should().BeTrue();
        _systemClockMock.SetupGet(c => c.UtcNow).Returns(now + TimeSpan.FromSeconds(2));
        service.IsWithinBruteforceTimeout("Root", guid).Should().BeTrue();

        _systemClockMock.SetupGet(c => c.UtcNow).Returns(now + TimeSpan.FromSeconds(45));
        service.IsWithinBruteforceTimeout("Root", guid).Should().BeFalse();
    }
}