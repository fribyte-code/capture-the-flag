namespace friByte.capture_the_flag.service.Models.Api;

public class InvitationWriteModel
{
    public string InvitationCode { get; set; } = null!;
    public DateTimeOffset? Expires { get; set; }
}