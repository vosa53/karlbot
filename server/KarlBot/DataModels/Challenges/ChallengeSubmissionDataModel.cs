using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Challenges
{
    /// <summary>
    /// Challenge submission.
    /// </summary>
    public class ChallengeSubmissionDataModel
    {
        /// <summary>
        /// ID.
        /// </summary>
        public required Guid? Id { get; init; }

        /// <summary>
        /// Id of the user who submitted it.
        /// </summary>
        public required Guid UserId { get; init; }

        /// <summary>
        /// Date and time of submission.
        /// </summary>
        public DateTime Created { get; init; }

        /// <summary>
        /// Submitted project file.
        /// </summary>
        [Required]
        [StringLength(50_000)]
        public required string ProjectFile { get; init; }

        /// <summary>
        /// Result of evaluation.
        /// </summary>
        public ChallengeSubmissionEvaluationResultDataModel? EvaluationResult { get; init; }
    }
}
