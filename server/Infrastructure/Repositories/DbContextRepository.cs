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
    /// Repository using the Application Entity Framework DbContext.
    /// </summary>
    /// <typeparam name="TEntity">Entity type.</typeparam>
    /// <typeparam name="TKey">Entity key type.</typeparam>
    public class DbContextRepository<TEntity, TKey> : IRepository<TEntity, TKey> where TEntity : class
    {
        /// <summary>
        /// Application DbContext.
        /// </summary>
        protected ApplicationDbContext DbContext { get; }

        /// <summary>
        /// Entity DbSet.
        /// </summary>
        protected DbSet<TEntity> DbSet { get; }

        /// <param name="dbContext">Application DbContext.</param>
        public DbContextRepository(ApplicationDbContext dbContext)
        {
            DbContext = dbContext;
            DbSet = DbContext.Set<TEntity>();
        }

        /// <inheritdoc/>
        public virtual async Task<List<TEntity>> GetAsync()
        {
            return await DbSet.ToListAsync();
        }

        /// <inheritdoc/>
        public virtual async Task<TEntity?> GetByIdAsync(TKey id)
        {
            return await DbSet.FindAsync(id).AsTask();
        }

        /// <inheritdoc/>
        public virtual async Task<bool> ExistsByIdAsync(TKey id)
        {
            var entity = await DbSet.FindAsync(id);
            return entity != null;
        }

        /// <inheritdoc/>
        public virtual async Task AddAsync(TEntity entity)
        {
            DbSet.Add(entity);
            await DbContext.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public virtual async Task RemoveAsync(TEntity entity)
        {
            DbSet.Remove(entity);
            await DbContext.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public virtual async Task UpdateAsync(TEntity entity)
        {
            DbSet.Update(entity);
            await DbContext.SaveChangesAsync();
        }
    }
}
