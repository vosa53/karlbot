using ApplicationCore.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationCore.Repositories
{
    /// <summary>
    /// Repository of challenges.
    /// </summary>
    public interface IChallengeRepository : IRepository<Challenge, Guid>
    {
        /// <summary>
        /// Returns all challenges with info about counts of submissions.
        /// <param name="userId">Id of the user to whom the info about counts of submissions is to be related.</param>
        /// </summary>
        Task<IList<ChallengeWithSubmissionsInfo>> GetWithSubmissionsInfoAsync(Guid userId);

        /// <summary>
        /// Returns the challenge with the given id or `null` if no challenge with the given id exists.
        /// Includes info about counts of submissions.
        /// </summary>
        /// <param name="id">Id of the requested challenge.</param>
        /// <param name="userId">Id of the user to whom the info about counts of submissions is to be related.</param>
        Task<ChallengeWithSubmissionsInfo?> GetByIdWithSubmissionsInfoAsync(Guid id, Guid userId);
    }

    /// <summary>
    /// Challenge with info about counts of submissions.
    /// </summary>
    public class ChallengeWithSubmissionsInfo
    {
        /// <summary>
        /// Challenge.
        /// </summary>
        public required Challenge Challenge { get; init; }

        /// <summary>
        /// Number of own submissions.
        /// </summary>
        public required int OwnSubmissionCount { get; init; }

        /// <summary>
        /// Number of own successful submissions.
        /// </summary>
        public required int OwnSuccessfulSubmissionCount { get; init; }

        /// <summary>
        /// Total number of users who submitted.
        /// </summary>
        public required int UsersSubmittedCount { get; init; }

        /// <summary>
        /// Total number of users who submitted successfully.
        /// </summary>
        public required int UsersSuccessfullySubmittedCount { get; init; }
    }
}
