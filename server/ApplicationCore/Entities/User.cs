using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
