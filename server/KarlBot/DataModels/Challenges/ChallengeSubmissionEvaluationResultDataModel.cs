using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Challenges
{
    /// <summary>
    /// Challenge submission evaluation result.
    /// </summary>
    public class ChallengeSubmissionEvaluationResultDataModel
    {
        /// <summary>
        /// Success ratio.
        /// </summary>
        [Range(0, 1)]
        public required double SuccessRate { get; init; }

        /// <summary>
        /// Message further descripting the result.
        /// </summary>
        [Required]
        public required string Message { get; init; }
    }
}
