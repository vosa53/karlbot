using ApplicationCore.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationCore.Repositories
{
    /// <summary>
    /// Repository of projects.
    /// </summary>
    public interface IProjectRepository : IRepository<Project, int>
    {
        Task<List<Project>> GetAsync(string? authorId);
    }
}
