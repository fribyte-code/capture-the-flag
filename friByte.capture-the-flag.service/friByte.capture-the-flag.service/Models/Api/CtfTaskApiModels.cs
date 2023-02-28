namespace friByte.capture_the_flag.service.Models.Api;

/// <summary>
/// Class for the data that will be sent to the frontend and displayed
/// to all clients.
/// All data in this class will be public, so flags should not be included here
/// If you update the dbModel <see cref="CtfTask"/> then you need to update this as well
/// </summary>
public class CtfTaskReadModel
{
    public CtfTaskReadModel(CtfTask dbModel)
    {
        Id = dbModel.Id;
        Name = dbModel.Name;
        Points = dbModel.Points;
        Description = dbModel.Description;
    }

    public Guid Id { get; }
    public string Name { get; }
    public int Points { get; }
    public string Description { get;  }
}

/// <summary>
/// Class for required data needed to add or update a new task
/// If you update the dbModel <see cref="CtfTask"/> then you probably need to update this as well
/// </summary>
public class CtfTaskWriteModel
{
    public string Name { get; set; }
    public string Flag { get; set; }
    public int Points { get; set; }
    public string Description { get; set; }
}