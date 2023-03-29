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
    /// User repository using the Application Entity Framework DbContext.
    /// </summary>
    public class DbContextUserRepository : DbContextRepository<User, string>, IUserRepository
    {
        /// <param name="dbContext">Application DbContext.</param>
        public DbContextUserRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }
    }
}
