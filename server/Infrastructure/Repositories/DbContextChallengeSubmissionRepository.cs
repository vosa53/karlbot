using ApplicationCore.Entities;
using ApplicationCore.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    /// <summary>
    /// Challenge submission repository using the Application Entity Framework DbContext.
    /// </summary>
    public class DbContextChallengeSubmissionRepository : DbContextRepository<ChallengeSubmission, Guid>, IChallengeSubmissionRepository
    {
        /// <param name="dbContext">Application DbContext.</param>
        public DbContextChallengeSubmissionRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        /// <inheritdoc/>
        public async Task<IList<ChallengeSubmission>> GetAsync(Guid challengeId, Guid? userId)
        {
            IQueryable<ChallengeSubmission> query = DbSet.Where(cs => cs.ChallengeId == challengeId);

            if (userId != null)
                query = query.Where(cs => cs.UserId == userId);

            return await query.ToListAsync();
        }
    }
}
