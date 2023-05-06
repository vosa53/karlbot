using Microsoft.AspNetCore.Identity;

namespace ApplicationCore.Entities
{
    /// <summary>
    /// User.
    /// </summary>
    public class User : IdentityUser<Guid>
    {
        /// <param name="email">Email. Will be used also as a username.</param>
        public User(string email)
        {
            UserName = email;
            Email = email;
        }
    }
}
