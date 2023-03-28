using ApplicationCore.Entities;
using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Projects
{
    public class ProjectDataModel
    {
        [Range(0, int.MaxValue)]
        public required int Id { get; init; }

        [StringLength(36, MinimumLength = 36)]
        public required string AuthorId { get; init; }
        public required bool IsPublic { get; init; }
        public required DateTime Created { get; init; }
        public required DateTime Modified { get; init; }

        [StringLength(50_000)]
        public required string ProjectFile { get; init; }
    }
}
