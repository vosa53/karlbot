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
    public class DbContextChallengeRepository : DbContextRepository<Challenge, int>, IChallengeRepository
    {
        public DbContextChallengeRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

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

        public override async Task AddAsync(Challenge entity)
        {
            SetOrders(entity.TestCases);
            DbSet.Add(entity);
            await DbContext.SaveChangesAsync();
        }

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
