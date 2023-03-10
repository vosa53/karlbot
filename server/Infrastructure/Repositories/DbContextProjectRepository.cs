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
    public class DbContextProjectRepository : DbContextRepository<Project, int>, IProjectRepository
    {
        public DbContextProjectRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<List<Project>> GetAsync(string? authorId)
        {
            IQueryable<Project> query = DbSet;

            if (authorId != null)
                query = query.Where(p => p.AuthorId == authorId);

            return await query.ToListAsync();
        }
    }
}
