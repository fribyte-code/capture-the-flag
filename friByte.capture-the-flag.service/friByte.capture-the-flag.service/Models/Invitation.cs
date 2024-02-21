namespace friByte.capture_the_flag.service.Models;

/// <summary>
/// Database model for storing the actual CTF tasks
/// </summary>
public class Invitation : DbBaseEntity
{
    /// <summary>
    /// Only to be used by Entity Framework
    /// </summary>
    public Invitation() { }

    public string InvitationCode { get; set; } = null!;
    public DateTimeOffset? Expires { get; set; }
}