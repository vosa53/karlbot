using ApplicationCore.Entities;
using ApplicationCore.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    /// <summary>
    /// Project repository using the Application Entity Framework DbContext.
    /// </summary>
    public class DbContextProjectRepository : DbContextRepository<Project, Guid>, IProjectRepository
    {
        /// <param name="dbContext">Application DbContext.</param>
        public DbContextProjectRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        /// <inheritdoc/>
        public async Task<IList<Project>> GetAsync(Guid? authorId)
        {
            IQueryable<Project> query = DbSet;

            if (authorId != null)
                query = query.Where(p => p.AuthorId == authorId);

            return await query.ToListAsync();
        }
    }
}
