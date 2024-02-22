using System.Security.Claims;
using friByte.capture_the_flag.service.Models;
using friByte.capture_the_flag.service.Models.Api;
using friByte.capture_the_flag.service.Services.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace friByte.capture_the_flag.service.Controllers;

[ApiController]
[Authorize(Roles = $"{IdentityRoleNames.AdminRoleName}")]
[Produces("application/json")]
[Route("Api/[controller]")]
public class
    TeamController : ControllerBase
{
    private readonly ILogger<TeamController> _logger;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly CtfContext _dbContext;

    public TeamController(
        ILogger<TeamController> logger,
        UserManager<ApplicationUser> userManager,
        CtfContext dbContext
    )
    {
        _logger = logger;
        _userManager = userManager;
        _dbContext = dbContext;
    }

    [HttpGet("", Name = "AllTeams")]
    public async Task<ActionResult<IList<ApplicationUser>>> GetAll()
    {
        var teams = await _userManager.GetUsersInRoleAsync(IdentityRoleNames.TeamRoleName);
        return Ok(teams);
    }

    /// <summary>
    /// Add a new team
    /// </summary>
    [HttpPost("", Name = "AddTeam")]
    public async Task<IActionResult> Add([FromBody] NewTeam newTeam)
    {
        await CreateTeam(newTeam.Username);

        return Ok(new { Message = "Logged in" });
    }

    /// <summary>
    /// Get the one and only possible invitation
    /// </summary>
    [HttpGet("invitation", Name = "GetInvitationLink")]
    public async Task<Invitation?> GetInvitationLink()
    {
        var invitation = await _dbContext.Invitations.FirstOrDefaultAsync();
        return invitation;
    }

    /// <summary>
    /// Will add or replace existing invitation link
    /// Currently only one invitation link is supported.
    /// </summary>
    /// <param name="invitationWriteModel"></param>
    /// <returns></returns>
    [HttpPost("invitation", Name = "PostInvitationLink")]
    public async Task AddInvitationLink([FromBody] InvitationWriteModel invitationWriteModel)
    {
        _logger.LogInformation("Updating or adding invitation link");
        var existingInvitation = await _dbContext.Invitations.FirstOrDefaultAsync();
        if (existingInvitation != null)
        {
            existingInvitation.InvitationCode = invitationWriteModel.InvitationCode;
            existingInvitation.Expires = invitationWriteModel.Expires;
        }
        else
        {
            _dbContext.Invitations.Add(new Invitation
            {
                InvitationCode = invitationWriteModel.InvitationCode,
                Expires = invitationWriteModel.Expires
            });
        }

        await _dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// Register a new team using an invitation link and receive the team account with generated password.
    /// Currently we do not allow custom password as passwords are stored in clear text.
    /// </summary>
    /// <param name="model"></param>
    /// <returns>The newly created ApplicationUser</returns>
    [AllowAnonymous]
    [HttpPost("invitation/register", Name = "RegisterWithInvitationLink")]
    public async Task<ActionResult<ApplicationUser>> RegisterWithInvitationLink([FromBody] Register model)
    {
        var invitation = await _dbContext.Invitations.FirstOrDefaultAsync(i => i.InvitationCode == model.InvitationCode);
        if (invitation == null)
        {
            return BadRequest("Supplied invitation code is invalid");
        }

        if (invitation.Expires != null && invitation.Expires < DateTime.UtcNow)
        {
            return BadRequest("Invitation has expired");
        }

        try
        {
            var addedTeam = await CreateTeam(model.Username);

            return Ok(addedTeam);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Failed to create team via invitation link");
            return BadRequest(e.Message);
        }
    }

    private async Task<ApplicationUser> CreateTeam(string teamName, string? password = null)
    {
        password = password ?? GenerateTeamPassword();
        // password for teams are stored in clear text
        var teamAccount = new ApplicationUser { UserName = teamName, TeamPassword = password };

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

        return teamAccount;
    }

    /// <summary>
    /// Generate a random passphrase based on a wordlist
    /// </summary>
    private static string GenerateTeamPassword()
    {
        var adjectivesAndVerbs = new[]
        {
            "awesome", "sad", "happy", "angry", "excited", "big", "small", "huge", "tiny", "singing", "hacking", "coding", "sleeping", "running", "jumping", "flying", "swimming", "dancing", "singing", "laughing", "crying", "screaming", "whispering", "yelling", "talking", "walking", "sitting", "standing", "lying", "thinking", "dreaming", "eating", "drinking", "smoking", "kissing", "hugging", "loving", "hating", "fighting", "arguing", "debating", "winning", "losing", "drawing", "painting", "writing", "reading", "learning", "teaching", "cooking", "baking", "cleaning", "washing", "drying", "ironing", "sewing", "knitting", "crocheting", "weaving", "spinning", "dyeing", "printing", "photographing", "filming", "recording", "playing", "singing", "dancing", "acting", "directing", "producing", "editing", "composing", "arranging", "conducting", "performing", "listening", "watching", "reading", "writing", "drawing", "painting", "sculpting", "carving", "engraving", "building", "constructing", "designing", "planning", "organizing", "managing", "leading", "following", "helping", "assisting", "supporting", "encouraging", "motivating", "inspiring", "influencing", "persuading", "convincing", "arguing", "debating", "discussing", "talking", "speaking", "whispering", "yelling", "screaming", "crying", "laughing", "smiling", "frowning", "grinning", "winking", "blinking", "nodding", "bowing", "saluting", "waving", "pointing", "touching", "holding", "grabbing", "squeezing", "pushing", "pulling", "lifting", "dropping", "throwing", "catching", "kicking", "punching", "hitting", "slapping", "scratching", "biting", "licking",
        };
        var nouns = new[]
        {
            "team", "penguin", "anaconda", "friByte", "hacker", "password", "turtle", "apple", "horse", "tesla", "car", "bike", "boat", "plane", "train", "bus", "truck", "lorry", "van", "motorcycle", "scooter", "skateboard", "rollerblades", "rollercoaster", "carousel", "swing", "slide", "seesaw",
        };

        var rnd = new Random();
        var passPhrase = new List<string>
        {
            adjectivesAndVerbs[rnd.Next(adjectivesAndVerbs.Length)],
            nouns[rnd.Next(nouns.Length)],
        };

        return string.Join("-", passPhrase);
    }
}

public class NewTeam
{
    public string Username { get; set; }
}

public class Register : NewTeam
{
    public string InvitationCode { get; set; }
}