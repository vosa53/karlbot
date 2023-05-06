namespace ApplicationCore.Services
{
    /// <summary>
    /// Service to interact with <see href="https://firebase.google.com/docs/auth">Firebase Authentication</see>.
    /// </summary>
    public interface IFirebaseAuthenticationService
    {
        /// <summary>
        /// Verifies whether the given Firebase ID token is valid.
        /// </summary>
        /// <param name="idToken">Firebase ID token.</param>
        /// <returns>Firebase user represented by the ID token or null if the token is invalid.</returns>
        Task<FirebaseUser?> VerifyIdTokenAsync(string idToken);
    }

    /// <summary>
    /// User from <see href="https://firebase.google.com/docs/auth">Firebase Authentication</see>.
    /// </summary>
    /// <param name="Uid">Firebase user ID.</param>
    /// <param name="Email">Firebase user email.</param>
    public record FirebaseUser(string Uid, string Email);
}
