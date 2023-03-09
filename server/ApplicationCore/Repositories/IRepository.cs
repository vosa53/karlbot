using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationCore.Repositories
{
    public interface IRepository<T, K>
    {
        Task<List<T>> GetAllAsync();
        Task<T?> GetByIdAsync(K id);
        Task Add(T entity);
        Task Update(T entity);
        Task Remove(T entity);
    }
}
