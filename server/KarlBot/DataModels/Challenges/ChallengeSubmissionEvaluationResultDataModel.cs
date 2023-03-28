using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Challenges
{
    public class ChallengeSubmissionEvaluationResultDataModel
    {
        [Range(0, 1)]
        public required double SuccessRate { get; init; }
        public required string Message { get; init; }
    }
}
