using ApplicationCore.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationCore.Repositories
{
    /// <summary>
    /// Repository of users.
    /// </summary>
    public interface IUserRepository : IRepository<User, string>
    {
    }
}
