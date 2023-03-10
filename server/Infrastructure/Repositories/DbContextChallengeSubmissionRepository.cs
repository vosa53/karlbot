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
    public class DbContextChallengeSubmissionRepository : DbContextRepository<ChallengeSubmission, int>, IChallengeSubmissionRepository
    {
        public DbContextChallengeSubmissionRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<List<ChallengeSubmission>> GetAsync(int challlengeId, string? userId)
        {
            IQueryable<ChallengeSubmission> query = DbSet;

            if (userId != null)
                query = query.Where(cs => cs.UserId == userId);

            return await query.ToListAsync();
        }
    }
}
