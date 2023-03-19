using ApplicationCore.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class DbContextRepository<T, K> : IRepository<T, K> where T : class
    {
        protected ApplicationDbContext DbContext { get; }
        protected DbSet<T> DbSet { get; }

        public DbContextRepository(ApplicationDbContext dbContext)
        {
            DbContext = dbContext;
            DbSet = DbContext.Set<T>();
        }

        public virtual async Task<List<T>> GetAsync()
        {
            return await DbSet.ToListAsync();
        }

        public virtual async Task<T?> GetByIdAsync(K id)
        {
            return await DbSet.FindAsync(id).AsTask();
        }

        public virtual async Task<bool> ExistsByIdAsync(K id)
        {
            var entity = await DbSet.FindAsync(id);
            return entity != null;
        }

        public virtual async Task AddAsync(T entity)
        {
            DbSet.Add(entity);
            await DbContext.SaveChangesAsync();
        }

        public virtual async Task RemoveAsync(T entity)
        {
            DbSet.Remove(entity);
            await DbContext.SaveChangesAsync();
        }

        public virtual async Task UpdateAsync(T entity)
        {
            DbSet.Update(entity);
            await DbContext.SaveChangesAsync();
        }
    }
}
