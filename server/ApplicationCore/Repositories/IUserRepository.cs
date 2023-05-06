using ApplicationCore.Entities;

namespace ApplicationCore.Repositories
{
    /// <summary>
    /// Repository of users.
    /// </summary>
    public interface IUserRepository : IRepository<User, Guid>
    {
        /// <summary>
        /// Returns role names the given user belongs to.
        /// </summary>
        /// <param name="userId">Id of the user whose roles are requested.</param>
        Task<IList<string>?> GetRolesAsync(Guid userId);
    }
}
