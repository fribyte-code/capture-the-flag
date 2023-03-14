using System.Security.Claims;
using friByte.capture_the_flag.service.Models;
using friByte.capture_the_flag.service.Models.Dtos;
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
[Produces("application/json")]
[Route("Api/[controller]/[action]")]
public class 
    AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;

    public AuthController(
        ILogger<AuthController> logger,
        SignInManager<ApplicationUser> signInManager,
        UserManager<ApplicationUser> userManager)
    {
        _logger = logger;
        _signInManager = signInManager;
        _userManager = userManager;
    }
    
    /// <summary>
    /// Login and receive a cookie
    /// </summary>
    /// <param name="credentials">username and password</param>
    /// <returns></returns>
    /// <response code="401">Wrong username or password</response>
    [HttpPost(Name = "login")]
    public async Task<IActionResult> Login([FromBody] LoginCredentials credentials)
    {
        var signInResult = await _signInManager.PasswordSignInAsync(
            credentials.Username,
            credentials.Password,
            isPersistent: true,
            lockoutOnFailure: false
        );

        if (signInResult == SignInResult.Failed)
        {
            return new UnauthorizedObjectResult(new { Message = "Wrong username or password" });
        }

        var claims = new List<Claim>()
        {
            // Perhaps add some claims like username and roles here
        };
        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(claimsIdentity));
        
        return Ok(new { Message = "Logged in" });
    }

    [HttpGet(Name = "logout")]
    public async Task<ActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignOutAsync("Identity.Application");
        return Ok(new { Message = "Logged out" });
    }

    /// <summary>
    /// Get logged in account
    /// </summary>
    /// <response code="401">When cookie is invalid, indicates that user need to login</response>
    [HttpGet(Name = "me")]
    public async Task<ActionResult<LoggedInUserDto>> Me()
    {
        var teamName = HttpContext.User.FindFirstValue(ClaimTypes.Name);
        if (teamName == null)
        {
            return Unauthorized();
        }

        var team = await _userManager.Users.Where(t => t.UserName == teamName).FirstOrDefaultAsync();

        if (team == null)
        {
            return Unauthorized();
        }

        var roles = await _userManager.GetRolesAsync(team);
        var dto = new LoggedInUserDto
        {
            TeamName = team.UserName,
            IsAdmin = roles.Contains(IdentityRoleNames.AdminRoleName)
        };
        return Ok(dto);
    }
}

public class LoginCredentials
{
    public string Username { get; set; }
    public string Password { get; set; }
}