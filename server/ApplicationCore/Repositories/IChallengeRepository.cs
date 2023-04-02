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
    public interface IChallengeRepository : IRepository<Challenge, int>
    {
        Task<IList<ChallengeWithSubmissionsInfo>> GetWithSubmissionsInfoAsync(string userId);

        Task<ChallengeWithSubmissionsInfo?> GetByIdWithSubmissionsInfoAsync(int id, string userId);
    }

    /// <summary>
    /// Challenge with info about counts of submissions.
    /// </summary>
    public class ChallengeWithSubmissionsInfo
    {
        public required Challenge Challenge { get; init; }

        /// <summary>
        /// Nummber of own submissions.
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
