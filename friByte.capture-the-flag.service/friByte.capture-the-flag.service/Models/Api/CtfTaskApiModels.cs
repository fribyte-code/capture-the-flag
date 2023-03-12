namespace friByte.capture_the_flag.service.Models.Api;

/// <summary>
/// Class for the data that will be sent to the frontend and displayed
/// to all clients.
/// All data in this class will be public, so flags should not be included here
/// If you update the dbModel <see cref="CtfTask"/> then you need to update this as well
/// </summary>
public class CtfTaskReadModel
{
    public CtfTaskReadModel() { }
    public CtfTaskReadModel(CtfTask dbModel, bool? isSolved = null)
    {
        Id = dbModel.Id;
        Name = dbModel.Name;
        Points = dbModel.Points;
        Description = dbModel.Description;
        IsSolved = isSolved;
    }

    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Points { get; set; }
    public string Description { get; set; }
    public bool? IsSolved { get; set; }
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