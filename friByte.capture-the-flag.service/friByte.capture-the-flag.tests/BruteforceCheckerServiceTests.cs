using FluentAssertions;
using friByte.capture_the_flag.service.Models;
using friByte.capture_the_flag.service.Models.Api;
using friByte.capture_the_flag.service.Services;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace friByte.capture_the_flag.tests;

[TestClass]
public class BruteforceCheckerServiceTests
{

    private static IBruteforceCheckerService GetService()
    {
        return new BruteforceCheckerService();
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
}