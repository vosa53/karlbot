using ApplicationCore.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
