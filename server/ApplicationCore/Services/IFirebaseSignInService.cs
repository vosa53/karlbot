using ApplicationCore.Entities;

namespace ApplicationCore.Services
{
    /// <summary>
    /// Service to sign in Firebase users into the application.
    /// </summary>
    public interface IFirebaseSignInService
    {
        /// <summary>
        /// Signs the Firebase user in and returns his application entity.
        /// If he already exists in the application, tries to find him, otherwise creates him.
        /// </summary>
        /// <param name="firebaseUser">Firebase user.</param>
        /// <returns>Application user.</returns>
        public Task<User> SignInAsync(FirebaseUser firebaseUser);
    }
}
