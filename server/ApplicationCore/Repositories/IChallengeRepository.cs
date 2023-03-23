using ApplicationCore.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationCore.Repositories
{
    /// <summary>
    /// Repository of challenges.
    /// </summary>
    public interface IChallengeRepository : IRepository<Challenge, int>
    {
    }
}
