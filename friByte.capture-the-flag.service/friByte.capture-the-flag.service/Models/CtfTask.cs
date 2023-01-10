namespace friByte.capture_the_flag.service.Models;

/// <summary>
/// Database model for storing the actual CTF tasks
/// </summary>
public class CtfTask : DbBaseEntity
{
    // TODO: Refine model
    public CtfTask(string name, string flag)
    {
        Name = name;
        Flag = flag;
    }
    
    /// <summary>
    /// Only to be used by Entity Framework
    /// </summary>
    public CtfTask() {}

    public string Name { get; set; }
    public string Flag { get; set; }
}