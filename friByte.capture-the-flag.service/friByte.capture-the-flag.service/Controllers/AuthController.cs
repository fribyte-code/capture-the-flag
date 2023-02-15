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
[Produces("application/json")]
[Route("Api/[controller]/[action]")]
public class 
    AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;
    private readonly SignInManager<ApplicationUser> _signInManager;

    public AuthController(
        ILogger<AuthController> logger,
        SignInManager<ApplicationUser> signInManager
    )
    {
        _logger = logger;
        _signInManager = signInManager;
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

    [Authorize]
    [HttpGet(Name = "logout")]
    public async Task<ActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok(new { Message = "Logged out" });
    }
}

public class LoginCredentials
{
    public string Username { get; set; }
    public string Password { get; set; }
}