namespace friByte.capture_the_flag.service.Models;

/// <summary>
/// Database model for storing the actual CTF tasks
/// </summary>
public class CtfTask : DbBaseEntity
{
    public CtfTask(
        string name,
        string flag,
        int points,
        string description,
        DateTimeOffset? releaseDateTime,
        string? category
    )
    {
        Name = name;
        Flag = flag;
        Points = points;
        Description = description;
        ReleaseDateTime = releaseDateTime;
        Category = category;
    }

    /// <summary>
    /// Only to be used by Entity Framework
    /// </summary>
    public CtfTask() { }

    public string Name { get; set; }
    public string Flag { get; set; }
    public int Points { get; set; }
    public string Description { get; set; }
    public List<SolvedTask> SuccessfullSolveAttempts { get; set; }
    public DateTimeOffset? ReleaseDateTime { get; set; }
    public string? Category { get; set; }
}