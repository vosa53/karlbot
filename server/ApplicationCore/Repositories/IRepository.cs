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
    /// <typeparam name="T">Entity type.</typeparam>
    /// <typeparam name="K">Entity key type.</typeparam>
    public interface IRepository<T, K>
    {
        /// <summary>
        /// Returns all entites.
        /// </summary>
        Task<List<T>> GetAsync();

        /// <summary>
        /// Returns the entity with the given id or `null` if no entity with the given id exists.
        /// </summary>
        /// <param name="id">Id of the required entity.</param>
        Task<T?> GetByIdAsync(K id);

        /// <summary>
        /// Returns wheter an entity with the given id exists.
        /// </summary>
        /// <param name="id">Entity id.</param>
        Task<bool> ExistsByIdAsync(K id);

        /// <summary>
        /// Adds the given entity.
        /// </summary>
        /// <param name="entity">Entity to add.</param>
        Task AddAsync(T entity);

        /// <summary>
        /// Updates the given entity.
        /// </summary>
        /// <param name="entity">Entity to update.</param>S
        Task UpdateAsync(T entity);

        /// <summary>
        /// Removes the given entity.
        /// </summary>
        /// <param name="entity">Entity to remove.</param>
        Task RemoveAsync(T entity);
    }
}
