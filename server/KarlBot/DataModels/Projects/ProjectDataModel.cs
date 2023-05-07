using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Projects
{
    /// <summary>
    /// Project.
    /// </summary>
    public class ProjectDataModel
    {
        /// <summary>
        /// ID.
        /// </summary>
        public required Guid? Id { get; init; }

        /// <summary>
        /// ID of the author.
        /// </summary>
        public required Guid AuthorId { get; init; }

        /// <summary>
        /// Wheter it is publicly accessible or only for its author.
        /// </summary>
        public required bool IsPublic { get; init; }

        /// <summary>
        /// Date and time when the project was created.
        /// </summary>
        public DateTime Created { get; init; }

        /// <summary>
        /// Date and time of the last project modification.
        /// </summary>
        public DateTime Modified { get; init; }

        /// <summary>
        /// Project file.
        /// </summary>
        [Required]
        [StringLength(50_000)]
        public required string ProjectFile { get; init; }
    }
}
