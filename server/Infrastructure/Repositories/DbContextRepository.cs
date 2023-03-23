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
    /// Repository implementation using the Application Entity Framework DbContext.
    /// </summary>
    /// <typeparam name="T">Entity type.</typeparam>
    /// <typeparam name="K">Entity key type.</typeparam>
    public class DbContextRepository<T, K> : IRepository<T, K> where T : class
    {
        /// <summary>
        /// DbContext.
        /// </summary>
        protected ApplicationDbContext DbContext { get; }

        /// <summary>
        /// Entity DbSet.
        /// </summary>
        protected DbSet<T> DbSet { get; }

        /// <param name="dbContext">Application DbContext.</param>
        public DbContextRepository(ApplicationDbContext dbContext)
        {
            DbContext = dbContext;
            DbSet = DbContext.Set<T>();
        }

        /// <inheritdoc/>
        public virtual async Task<List<T>> GetAsync()
        {
            return await DbSet.ToListAsync();
        }

        /// <inheritdoc/>
        public virtual async Task<T?> GetByIdAsync(K id)
        {
            return await DbSet.FindAsync(id).AsTask();
        }

        /// <inheritdoc/>
        public virtual async Task<bool> ExistsByIdAsync(K id)
        {
            var entity = await DbSet.FindAsync(id);
            return entity != null;
        }

        /// <inheritdoc/>
        public virtual async Task AddAsync(T entity)
        {
            DbSet.Add(entity);
            await DbContext.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public virtual async Task RemoveAsync(T entity)
        {
            DbSet.Remove(entity);
            await DbContext.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public virtual async Task UpdateAsync(T entity)
        {
            DbSet.Update(entity);
            await DbContext.SaveChangesAsync();
        }
    }
}
