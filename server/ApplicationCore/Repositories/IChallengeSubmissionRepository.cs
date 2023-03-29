using ApplicationCore.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationCore.Repositories
{
    /// <summary>
    /// Repository of challenge submissions.
    /// </summary>
    public interface IChallengeSubmissionRepository : IRepository<ChallengeSubmission, int>
    {
        /// <summary>
        /// Returrns all submissions of the given challenge that were submitted by the given user.
        /// </summary>
        /// <param name="challlengeId">Id of the challenge.</param>
        /// <param name="userId">Id of the user.</param>
        Task<List<ChallengeSubmission>> GetAsync(int challlengeId, string? userId);
    }
}
