namespace friByte.capture_the_flag.service.Models;

/// <summary>
/// Database model for storing the actual CTF tasks
/// </summary>
public class SolvedTask : DbBaseEntity
{
    public SolvedTask(string teamId, CtfTask task)
    {
        TeamId = teamId;
        Task = task;
    }
    
    /// <summary>
    /// Only to be used by Entity Framework
    /// </summary>
    public SolvedTask()
    {
    }

    /// <summary>
    /// Team is stored as an applicationUser in the IdentityContext, so we can not reference it directly.
    /// </summary>
    public string TeamId { get; set; }
    /// <summary>
    /// Entity Framework will automatically connect SolvedTask to CtfTask in the SQL database
    /// </summary>
    public CtfTask Task { get; set; }
    /// <summary>
    /// TaskId is added to create a Fully defined Relationship https://learn.microsoft.com/en-us/ef/core/modeling/relationships?tabs=fluent-api%2Cfluent-api-simple-key%2Csimple-key#fully-defined-relationships
    /// </summary>
    public Guid TaskId { get; set; }
    
    // TODO: Connect SolvedTask to an event, such that we can use the same application over multiple events.
}
