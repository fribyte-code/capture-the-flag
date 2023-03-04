using friByte.capture_the_flag.service.Hubs;
using friByte.capture_the_flag.service.Models;
using friByte.capture_the_flag.service.Services;
using friByte.capture_the_flag.service.Services.Auth;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ====================================
// Dependency inject services here
// Transient => Classes that will be re-instantiated for every usage.
//              -> Most used
// Singleton => Classes that we only want to create once, like caches.
// Scoped => Classes that will be instantiated once per web request,
//            mostly the same as transient, but could be more resource efficient in some cases.
//              -> Rarely used
builder.Services.AddTransient<ICtfTaskService, CtfTaskService>();
builder.Services.AddTransient<ICtfLeaderboardService, CtfLeaderboardService>();
builder.Services.AddSingleton<IBruteforceCheckerService, BruteforceCheckerService>();

// SignalR is Microsoft's implementation of the WebSocket standard
// It enables us to push messages to all subscribed clients
// We use it mainly to have a live scoreboard
builder.Services.AddSignalR();

// ====================================

// DbContext for normal data
builder.Services.AddDbContext<CtfContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("postgres")));
// Separate DbContext for applicationUsers etc. It's good practice to have separate db for accounts
builder.Services.AddDbContext<IdentityContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("IdentityPostgres")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(opt =>
    {
        opt.Password.RequireLowercase = false;
        opt.Password.RequireNonAlphanumeric = false;
        opt.Password.RequireUppercase = false;
        opt.Password.RequireDigit = false;
        opt.Password.RequiredLength = 6;
        opt.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._+/ ";
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<IdentityContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication()
    .AddCookie();
builder.Services.AddAuthorization();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Events = new CookieAuthenticationEvents
    {
        OnRedirectToLogin = redirectContext =>
        {
            redirectContext.Response.Clear();
            redirectContext.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        },
        OnRedirectToAccessDenied = redirectContext =>
        {
            redirectContext.Response.Clear();
            redirectContext.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        },
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultCorsPolicy", policy =>
    {
        policy.WithOrigins("https://ctf.fribyte.no", "http://localhost:5173");
        policy.AllowAnyMethod();
        policy.AllowAnyHeader();
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

await MigrateAndSeedData();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("DefaultCorsPolicy");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<CtfSignalrHub>("/api/signalr");

app.Run();


async Task MigrateAndSeedData()
{
    // Updates database to latest version and add demo data if empty
    using var serviceScope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();
    var dbContext = serviceScope.ServiceProvider.GetRequiredService<CtfContext>();
    dbContext.Migrate();

    // Updates database to latest version and add demo data if empty
    var identityContext = serviceScope.ServiceProvider.GetRequiredService<IdentityContext>();
    identityContext.Migrate();

    // Add initial admin account
    var userManager = serviceScope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = serviceScope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var initialAdminPassword = builder.Configuration.GetValue<string>("InitialAdminPassword");
    await IdentityContextSeeder.SeedIdentityContextAsync(userManager, roleManager, initialAdminPassword);
}