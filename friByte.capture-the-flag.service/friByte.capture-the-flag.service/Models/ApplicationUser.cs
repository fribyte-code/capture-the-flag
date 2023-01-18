using Microsoft.AspNetCore.Identity;

namespace friByte.capture_the_flag.service.Models;

/// <summary>
/// Extension of the default IdentityUser, this is the place we can add extra properties we want on accounts
/// </summary>
public class ApplicationUser : IdentityUser
{
}