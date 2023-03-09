using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationCore.Services
{
    public interface IFirebaseAuthenticationService
    {
        Task<FirebaseUser?> VerifyIdTokenAsync(string idToken);
    }

    public record FirebaseUser(string Uid, string Email);
}
