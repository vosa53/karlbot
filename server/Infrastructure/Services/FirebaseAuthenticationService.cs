using ApplicationCore.Services;
using FirebaseAdmin.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class FirebaseAuthenticationService : IFirebaseAuthenticationService
    {
        public async Task<FirebaseUser?> VerifyIdTokenAsync(string idToken)
        {
            var firebaseAuth = FirebaseAuth.DefaultInstance;
            FirebaseToken decodedToken;
            try
            {
                decodedToken = await firebaseAuth.VerifyIdTokenAsync(idToken);
            }
            catch (FirebaseAuthException)
            {
                return null;
            }

            var user = await firebaseAuth.GetUserAsync(decodedToken.Uid);

            var email = user.Email ?? user.ProviderData.FirstOrDefault(p => p.Email != null)?.Email;
            if (email == null)
                throw new Exception();

            return new FirebaseUser(user.Uid, email);
        }
    }
}
