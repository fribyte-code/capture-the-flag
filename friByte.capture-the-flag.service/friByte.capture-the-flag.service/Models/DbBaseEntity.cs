using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace friByte.capture_the_flag.service.Models;

/// <summary>
/// Contains all the properties that are shared for all database tables.
/// </summary>
public class DbBaseEntity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}