using friByte.capture_the_flag.service.Models;
using friByte.capture_the_flag.service.Services;
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

// TODO: Add more services

// ====================================

builder.Services.AddDbContext<CtfContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("postgres")));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

MigrateAndSeedData();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();


void MigrateAndSeedData()
{
    // Updates database to latest version and add demo data if empty
    using var serviceScope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();
    var dbContext = serviceScope.ServiceProvider.GetRequiredService<CtfContext>();
    dbContext.Migrate();
}