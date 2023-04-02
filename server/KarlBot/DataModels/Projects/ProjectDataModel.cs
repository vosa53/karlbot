using ApplicationCore.Entities;
using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Projects
{
    public class ProjectDataModel
    {
        public required Guid? Id { get; init; }

        public required Guid AuthorId { get; init; }
        public required bool IsPublic { get; init; }
        public required DateTime Created { get; init; }
        public required DateTime Modified { get; init; }

        [StringLength(50_000)]
        public required string ProjectFile { get; init; }
    }
}
