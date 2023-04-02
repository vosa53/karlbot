using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Challenges
{
    public class ChallengeSubmissionsInfoDataModel
    {
        [Range(0, int.MaxValue)]
        public required int OwnSubmissionCount { get; init; }

        [Range(0, int.MaxValue)]
        public required int OwnSuccessfulSubmissionCount { get; init; }

        [Range(0, int.MaxValue)]
        public required int UsersSubmittedCount { get; init; }

        [Range(0, int.MaxValue)]
        public required int UsersSuccessfullySubmittedCount { get; init; }
    }
}
