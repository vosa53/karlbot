using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    /// <summary>
    /// Configuration of Firebase.
    /// </summary>
    public class FirebaseOptions
    {
        /// <summary>
        /// Project ID on Firebase.
        /// </summary>
        public required string ProjectId { get; set; }

        /// <summary>
        /// Path to a file with service account credentials.
        /// </summary>
        public required string CredentialFilePath { get; set; }

        /// <summary>
        /// URL of Firebase Authentication emulator.
        /// </summary>
        public required string AuthenticationEmulatorUrl { get; set; }
    }
}
