using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class FirebaseOptions
    {
        public string ProjectId { get; set; }
        public string CredentialFilePath { get; set; }
        public string AuthenticationEmulatorUrl { get; set; }
    }
}
