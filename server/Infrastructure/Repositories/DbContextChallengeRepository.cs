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
    public class DbContextChallengeRepository : DbContextRepository<Challenge, int>, IChallengeRepository
    {
        public DbContextChallengeRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }
    }
}
