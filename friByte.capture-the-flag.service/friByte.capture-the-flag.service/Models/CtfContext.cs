using Microsoft.EntityFrameworkCore;

namespace friByte.capture_the_flag.service.Models;

public class CtfContext : DbContext
{
    public CtfContext(DbContextOptions<CtfContext> options) : base(options) {}
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) => optionsBuilder.UseNpgsql();
    
    public DbSet<CtfTask> CtfTasks { get; set; }

    public void Migrate()
    {
        Database.Migrate();
    }
}