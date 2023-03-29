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
    public class DbContextChallengeRepository : DbContextRepository<Challenge, int>, IChallengeRepository
    {
        /// <param name="dbContext">Application DbContext.</param>
        public DbContextChallengeRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        /// <inheritdoc/>
        public override async Task<Challenge?> GetByIdAsync(int id)
        {
            var challenge = await DbSet
                .Where(c => c.Id == id)
                .Include(c => c.TestCases)
                .SingleOrDefaultAsync();
            if (challenge == null)
                return null;

            challenge.TestCases = challenge.TestCases.OrderBy(tc => tc.Order).ToList();
            return challenge;
        }

        /// <inheritdoc/>
        public override async Task AddAsync(Challenge entity)
        {
            SetOrders(entity.TestCases);
            DbSet.Add(entity);
            await DbContext.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public async Task UpdateAsync(Challenge entity)
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
    }
}
