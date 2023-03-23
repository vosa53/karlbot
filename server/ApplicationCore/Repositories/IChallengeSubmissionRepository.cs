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
        Task<List<ChallengeSubmission>> GetAsync(int challlengeId, string? userId);
    }
}
