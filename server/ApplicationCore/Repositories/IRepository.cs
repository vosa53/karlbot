using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationCore.Repositories
{
    /// <summary>
    /// Repository of entities.
    /// </summary>
    /// <typeparam name="TEntity">Entity type.</typeparam>
    /// <typeparam name="TKey">Entity key type.</typeparam>
    public interface IRepository<TEntity, TKey>
    {
        /// <summary>
        /// Returns all entites.
        /// </summary>
        Task<IList<TEntity>> GetAsync();

        /// <summary>
        /// Returns the entity with the given id or `null` if no entity with the given id exists.
        /// </summary>
        /// <param name="id">Id of the requested entity.</param>
        Task<TEntity?> GetByIdAsync(TKey id);

        /// <summary>
        /// Returns wheter an entity with the given id exists.
        /// </summary>
        /// <param name="id">Entity id.</param>
        Task<bool> ExistsByIdAsync(TKey id);

        /// <summary>
        /// Adds the given entity.
        /// </summary>
        /// <param name="entity">Entity to add.</param>
        Task AddAsync(TEntity entity);

        /// <summary>
        /// Updates the given entity.
        /// </summary>
        /// <param name="entity">Entity to update.</param>S
        Task UpdateAsync(TEntity entity);

        /// <summary>
        /// Removes the given entity.
        /// </summary>
        /// <param name="entity">Entity to remove.</param>
        Task RemoveAsync(TEntity entity);
    }
}
