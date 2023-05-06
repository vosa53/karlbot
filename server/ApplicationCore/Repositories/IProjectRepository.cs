using ApplicationCore.Entities;

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
        Task<IList<Project>> GetAsync(Guid? authorId);
    }
}
