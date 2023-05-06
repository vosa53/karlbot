using ApplicationCore.Entities;

namespace ApplicationCore.Services
{
    /// <summary>
    /// Service to issue tokens for users.
    /// </summary>
    public interface IUserTokenService
    {
        /// <summary>
        /// Creates token for the given user.
        /// </summary>
        /// <param name="user">User.</param>
        Task<string> CreateTokenAsync(User user);
    }
}
