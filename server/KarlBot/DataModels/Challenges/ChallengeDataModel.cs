using ApplicationCore.Entities;
using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Challenges
{
    public class ChallengeDataModel
    {
        public required Guid? Id { get; init; }

        [StringLength(100, MinimumLength = 1)]
        public required string Name { get; init; }

        [StringLength(10_000)]
        public required string Description { get; init; }

        public required ChallengeDifficulty Difficulty { get; init; }

        public ChallengeSubmissionsInfoDataModel? SubmissionsInfo { get; init; }

        public required IList<ChallengeTestCaseDataModel>? TestCases { get; init; }
    }
}
