using ApplicationCore.Entities;
using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Challenges
{
    public class ChallengeSubmissionDataModel
    {
        [Range(0, int.MaxValue)]
        public required int Id { get; init; }

        [StringLength(36, MinimumLength = 36)]
        public required string UserId { get; init; }
        public required DateTime Created { get; init; }

        [StringLength(50_000)]
        public required string ProjectFile { get; init; }
        public required ChallengeSubmissionEvaluationResultDataModel? EvaluationResult { get; init; }
    }
}
