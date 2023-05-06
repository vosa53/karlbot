using ApplicationCore.Entities;
using ApplicationCore.Services;
using Microsoft.AspNetCore.Identity;
using System.Diagnostics;

namespace Infrastructure.Services
{
    /// <summary>
    /// Firebase sign in service using <see cref="UserManager{TUser}"/>.
    /// </summary>
    public class UserManagerFirebaseSignInService : IFirebaseSignInService
    {
        private const string SIGN_IN_PROVIDER_NAME = "Firebase";
        private readonly UserManager<User> _userManager;

        /// <param name="userManager">User manager.</param>
        public UserManagerFirebaseSignInService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        /// <inheritdoc/>
        public async Task<User> SignInAsync(FirebaseUser firebaseUser)
        {
            var userByUid = await _userManager.FindByLoginAsync(SIGN_IN_PROVIDER_NAME, firebaseUser.Uid);
            if (userByUid != null)
                return userByUid;

            var userByEmail = await _userManager.FindByEmailAsync(firebaseUser.Email);
            if (userByEmail != null)
                return userByEmail;

            var newUser = new User(firebaseUser.Email);
            var result = await _userManager.CreateAsync(newUser);
            if (!result.Succeeded)
                throw new UnreachableException();

            var userLoginInfo = new UserLoginInfo(SIGN_IN_PROVIDER_NAME, firebaseUser.Uid, null);
            await _userManager.AddLoginAsync(newUser, userLoginInfo);

            return newUser;
        }
    }
}
