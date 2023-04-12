using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Challenges
{
    /// <summary>
    /// Info about submission counts of challenge.
    /// </summary>
    public class ChallengeSubmissionsInfoDataModel
    {
        /// <summary>
        /// Number of own submissions.
        /// </summary>
        [Range(0, int.MaxValue)]
        public required int OwnSubmissionCount { get; init; }

        /// <summary>
        /// Number of own successful submissions.
        /// </summary>
        [Range(0, int.MaxValue)]
        public required int OwnSuccessfulSubmissionCount { get; init; }

        /// <summary>
        /// Total number of users who submitted.
        /// </summary>
        [Range(0, int.MaxValue)]
        public required int UsersSubmittedCount { get; init; }

        /// <summary>
        /// Total number of users who submitted successfully.
        /// </summary>
        [Range(0, int.MaxValue)]
        public required int UsersSuccessfullySubmittedCount { get; init; }
    }
}
