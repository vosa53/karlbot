using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    /// <summary>
    /// Configuration of user tokens.
    /// </summary>
    public class UserTokenOptions
    {
        /// <summary>
        /// Issuer.
        /// </summary>
        public required string Issuer { get; set; }

        /// <summary>
        /// Audience.
        /// </summary>
        public required string Audience { get; set; }

        /// <summary>
        /// Signing key.
        /// </summary>
        public required string Key { get; set; }

        /// <summary>
        /// Lifetime in minutes.
        /// </summary>
        public required int LifetimeMinutes { get; set; }
    }
}
