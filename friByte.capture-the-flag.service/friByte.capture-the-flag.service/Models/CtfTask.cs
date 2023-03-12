namespace friByte.capture_the_flag.service.Models;

/// <summary>
/// Database model for storing the actual CTF tasks
/// </summary>
public class CtfTask : DbBaseEntity
{
    public CtfTask(string name, string flag, int points, string description)
    {
        Name = name;
        Flag = flag;
        Points = points;
        Description = description;
    }
    
    /// <summary>
    /// Only to be used by Entity Framework
    /// </summary>
    public CtfTask()
    { }

    public string Name { get; set; }
    public string Flag { get; set; }
    public int Points { get; set; }
    public string Description { get; set; }
    public List<SolvedTask> SuccessfullSolveAttempts { get; set; }
}