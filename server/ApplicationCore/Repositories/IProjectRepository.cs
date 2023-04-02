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
    public interface IProjectRepository : IRepository<Project, Guid>
    {
        /// <summary>
        /// Returns all projects of the given user.
        /// </summary>
        /// <param name="authorId">User id.</param>
        Task<List<Project>> GetAsync(Guid? authorId);
    }
}
