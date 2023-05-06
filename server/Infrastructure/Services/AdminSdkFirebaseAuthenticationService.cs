using ApplicationCore.Services;
using FirebaseAdmin.Auth;
using System.Diagnostics;

namespace Infrastructure.Services
{
    /// <summary>
    /// Firebase Authentication service using <see href="https://github.com/firebase/firebase-admin-dotnet">Firebase Admin .NET SDK</see>.
    /// </summary>
    public class AdminSdkFirebaseAuthenticationService : IFirebaseAuthenticationService
    {
        /// <inheritdoc/>
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
                throw new UnreachableException();

            return new FirebaseUser(user.Uid, email);
        }
    }
}
