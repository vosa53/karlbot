using ApplicationCore.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.DataSeeds
{
    /// <summary>
    /// Initializes the database with data for end-to-end tests.
    /// </summary>
    public static class EndToEndTestsDataSeed
    {
        /// <summary>
        /// Initializes the database with data for end-to-end tests.
        /// </summary>
        /// <param name="dbContext">Application DbContext.</param>
        public static async Task SeedAsync(ApplicationDbContext dbContext)
        {
            var adminUser = new User("john.doe@gmail.com") { Id = Guid.Parse("2063bb65-097c-4b37-b464-08db3386343d") };
            var adminRole = new IdentityRole<Guid>(RoleNames.Admin) { Id = Guid.Parse("08a6e542-50c8-4e5a-8037-ac967aa524d7") };
            var adminUserRole = new IdentityUserRole<Guid>() { UserId = adminUser.Id, RoleId = adminRole.Id };

            dbContext.AddRange(adminUser, adminRole, adminUserRole);
            await dbContext.SaveChangesAsync();
        }
    }
}
