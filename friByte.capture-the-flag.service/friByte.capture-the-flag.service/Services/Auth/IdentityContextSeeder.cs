using friByte.capture_the_flag.service.Models;
using Microsoft.AspNetCore.Identity;

namespace friByte.capture_the_flag.service.Services.Auth;

public static class IdentityRoleNames
{
    public const string AdminRoleName = "Admin";
    public const string TeamRoleName = "Team";
}

public static class IdentityContextSeeder
{
    /// <summary>
    /// Add the initial admin account to the IdentityContext
    /// </summary>
    /// <param name="userManager"></param>
    /// <param name="roleManager"></param>
    /// <param name="initialAdminPassword"></param>
    /// <exception cref="Exception"></exception>
    public static async Task SeedIdentityContextAsync(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        string initialAdminPassword
    )
    {

        var desiredRoles = new List<IdentityRole>()
        {
            new IdentityRole(IdentityRoleNames.AdminRoleName),
            new IdentityRole(IdentityRoleNames.TeamRoleName),
        };

        // Check all roles, adds the possibility for adding new roles later.
        foreach (var role in desiredRoles)
        {
            var roleExists = await roleManager.RoleExistsAsync(role.Name);
            if (!roleExists)
            {
                await roleManager.CreateAsync(role);
            }
        }

        // Only add user if there are no user already in database
        if (!userManager.Users.Any())
        {
            var adminUser = new ApplicationUser { UserName = "friByte" };

            var createAdminResult = await userManager.CreateAsync(adminUser, initialAdminPassword);
            if (createAdminResult.Succeeded)
            {
                var addAdminToRoleResult = await userManager.AddToRoleAsync(adminUser, IdentityRoleNames.AdminRoleName);
                if (!addAdminToRoleResult.Succeeded)
                {
                    throw new Exception($"Failed to add admin account to adminRole. {string.Join(", ", addAdminToRoleResult.Errors.Select(e => e.Description))}");
                }
            }
            else
            {
                throw new Exception($"Failed to add admin account. {string.Join(", ", createAdminResult.Errors.Select(e => e.Description))}");
            }
        }
    }
}