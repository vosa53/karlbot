using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationCore.Repositories
{
    public interface IRepository<T, K>
    {
        Task<List<T>> GetAsync();
        Task<T?> GetByIdAsync(K id);
        Task<bool> ExistsByIdAsync(K id);
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task RemoveAsync(T entity);
    }
}
