using ApplicationCore.Entities;
using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Challenges
{
    /// <summary>
    /// Challenge.
    /// </summary>
    public class ChallengeDataModel
    {
        /// <summary>
        /// ID.
        /// </summary>
        public required Guid? Id { get; init; }

        /// <summary>
        /// Name.
        /// </summary>
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public required string Name { get; init; }
        
        /// <summary>
        /// Description.
        /// </summary>
        [Required]
        [StringLength(10_000)]
        public required string Description { get; init; }

        /// <summary>
        /// Difficulty.
        /// </summary>
        public required ChallengeDifficulty Difficulty { get; init; }

        /// <summary>
        /// Info about count of submissions.
        /// </summary>
        public ChallengeSubmissionsInfoDataModel? SubmissionsInfo { get; init; }

        /// <summary>
        /// Test cases.
        /// </summary>
        public required IList<ChallengeTestCaseDataModel>? TestCases { get; init; }
    }
}
