using ApplicationCore.Entities;
using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Challenges
{
    public class ChallengeSubmissionDataModel
    {
        public required Guid? Id { get; init; }

        public required Guid UserId { get; init; }
        public required DateTime Created { get; init; }

        [StringLength(50_000)]
        public required string ProjectFile { get; init; }
        public required ChallengeSubmissionEvaluationResultDataModel? EvaluationResult { get; init; }
    }
}
