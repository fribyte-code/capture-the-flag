using System.Security.Claims;
using friByte.capture_the_flag.service.Models;
using friByte.capture_the_flag.service.Services.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace friByte.capture_the_flag.service.Controllers;

[ApiController]
[Authorize(Roles = $"{IdentityRoleNames.AdminRoleName}")]
[Produces("application/json")]
[Route("Api/[controller]/[action]")]
public class 
    TeamController : ControllerBase
{
    private readonly ILogger<TeamController> _logger;
    private readonly UserManager<ApplicationUser> _userManager;

    public TeamController(
        ILogger<TeamController> logger,
        UserManager<ApplicationUser> userManager)
    {
        _logger = logger;
        _userManager = userManager;
    }

    [HttpGet("")]
    public async Task<ActionResult<IList<ApplicationUser>>> GetAll()
    {
        var teams = await _userManager.GetUsersInRoleAsync(IdentityRoleNames.TeamRoleName);
        return Ok(teams);
    }
    
    /// <summary>
    /// Add a new team
    /// </summary>
    [HttpPost("/add-team")]
    public async Task<IActionResult> Login([FromBody] NewTeam newTeam)
    {
        var password = GenerateTeamPassword();
        // password for teams are stored in clear text
        var teamAccount = new ApplicationUser { UserName = newTeam.Username, TeamPassword = password };
        
        var createResult = await _userManager.CreateAsync(teamAccount, password);
        if (createResult.Succeeded)
        {
            var addAccountToRoleResult = await _userManager.AddToRoleAsync(teamAccount, IdentityRoleNames.TeamRoleName);
            if (!addAccountToRoleResult.Succeeded)
            {
                throw new Exception(
                    $"Failed to add team account to teamRole. {string.Join(", ", addAccountToRoleResult.Errors.Select(e => e.Description))}");
            }
        }
        else
        {
            throw new Exception(
                $"Failed to add team account. {string.Join(", ", createResult.Errors.Select(e => e.Description))}");
        }

        return Ok(new { Message = "Logged in" });
    }

    /// <summary>
    /// Generate a random passphrase based on a wordlist
    /// </summary>
    public static string GenerateTeamPassword()
    {
        const int length = 4;
        var passwordParts = new[]
        {
            "team", "awesome", "penguin", "anaconda", "friByte", "coding", "hacker", "password", "turtle", "apple",
            "sad", "happy", "angry", "excited", "horse", "tesla", "big", "small", "huge", "tiny", "singing", "31", "69", "l33t"
        };
        
        var rnd = new Random();
        var passPhrase = new List<string>();
        for (var i = 0; i < length; i++)
        {
            passPhrase.Add(passwordParts[rnd.Next(passwordParts.Length)]);
        }

        return string.Join("-", passPhrase);
    }
}

public class NewTeam
{
    public string Username { get; set; }
}