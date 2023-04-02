using ApplicationCore.Entities;
using ApplicationCore.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    /// <summary>
    /// Challenge repository using the Application Entity Framework DbContext.
    /// </summary>
    public class DbContextChallengeRepository : DbContextRepository<Challenge, Guid>, IChallengeRepository
    {
        /// <param name="dbContext">Application DbContext.</param>
        public DbContextChallengeRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        /// <inheritdoc/>
        public async Task<IList<ChallengeWithSubmissionsInfo>> GetWithSubmissionsInfoAsync(Guid userId)
        {
            return await (from c in DbSet
                          join s in DbContext.ChallengeSubmissions on c.Id equals s.ChallengeId into j
                          from jl in j.DefaultIfEmpty()
                          group jl by c into grouped
                          select new ChallengeWithSubmissionsInfo
                          {
                              Challenge = grouped.Key,
                              OwnSubmissionCount = grouped.Count(s => s.UserId == userId),
                              OwnSuccessfulSubmissionCount = grouped.Count(s => s.UserId == userId && s.EvaluationSuccessRate == 1),
                              UsersSubmittedCount = grouped.Select(s => s.UserId).Distinct().Count(),
                              UsersSuccessfullySubmittedCount = grouped.Where(s => s.EvaluationSuccessRate == 1).Select(s => s.UserId).Distinct().Count()
                          }).ToListAsync();
        }

        /// <inheritdoc/>
        public async Task<ChallengeWithSubmissionsInfo?> GetByIdWithSubmissionsInfoAsync(Guid id, Guid userId)
        {
            return await CreateQuery(true)
                .Select(c => new ChallengeWithSubmissionsInfo
                {
                    Challenge = c,
                    OwnSubmissionCount = c.Submissions.Count(s => s.UserId == userId),
                    OwnSuccessfulSubmissionCount = c.Submissions.Count(s => s.UserId == userId && s.EvaluationSuccessRate == 1),
                    UsersSubmittedCount = c.Submissions.Select(s => s.UserId).Distinct().Count(),
                    UsersSuccessfullySubmittedCount = c.Submissions.Where(s => s.EvaluationSuccessRate == 1).Select(s => s.UserId).Distinct().Count()
                })
                .SingleOrDefaultAsync(c => c.Challenge.Id == id);
        }

        /// <inheritdoc/>
        public override async Task<Challenge?> GetByIdAsync(Guid id)
        {
            return await CreateQuery(true)
                .SingleOrDefaultAsync(c => c.Id == id);
        }

        /// <inheritdoc/>
        public override async Task AddAsync(Challenge entity)
        {
            SetOrders(entity.TestCases);
            DbSet.Add(entity);
            await DbContext.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public override async Task UpdateAsync(Challenge entity)
        {
            SetOrders(entity.TestCases);
            DbSet.Update(entity);
            await DbContext.SaveChangesAsync();
        }

        private void SetOrders(IList<ChallengeTestCase> testCases)
        {
            for (var i = 0; i < testCases.Count; i++)
                testCases[i].Order = i;
        }

        private IQueryable<Challenge> CreateQuery(bool includeTestCases)
        {
            if (includeTestCases)
                return DbSet.Include(c => c.TestCases.OrderBy(tc => tc.Order));
            else
                return DbSet;
        }
    }
}
