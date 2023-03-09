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
    public class DbContextUserRepository : DbContextRepository<User, string>, IUserRepository
    {
        public DbContextUserRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }
    }
}
