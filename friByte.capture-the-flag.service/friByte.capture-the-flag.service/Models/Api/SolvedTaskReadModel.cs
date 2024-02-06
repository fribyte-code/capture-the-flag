namespace friByte.capture_the_flag.service.Models.Api;

public class SolvedTaskReadModel : DbBaseEntity
{
    public SolvedTaskReadModel(SolvedTask dbModel)
    {
        Id = dbModel.Id;
        CreatedAt = dbModel.CreatedAt;
        TeamId = dbModel.TeamId;
        Task = new CtfTaskReadModel(dbModel.Task);
    }

    public SolvedTaskReadModel(string teamId, CtfTaskReadModel task)
    {
        TeamId = teamId;
        Task = task;
    }

    public string TeamId { get; }
    public CtfTaskReadModel Task { get; }
}