using ApplicationCore.Entities;
using ApplicationCore.Repositories;
using Microsoft.AspNetCore.Identity;
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
    public class DbContextUserRepository : DbContextRepository<User, Guid>, IUserRepository
    {
        private readonly UserManager<User> _userManager;

        /// <param name="dbContext">Application DbContext.</param>
        public DbContextUserRepository(ApplicationDbContext dbContext, UserManager<User> userManager) : base(dbContext)
        {
            _userManager = userManager;
        }

        /// <inheritdoc/>
        public async Task<IList<string>?> GetRolesAsync(Guid userId)
        {
            var user = await DbSet.FindAsync(userId);
            if (user == null)
                return null;

            return await _userManager.GetRolesAsync(user);
        }
    }
}
