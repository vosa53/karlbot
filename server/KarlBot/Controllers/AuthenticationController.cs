using ApplicationCore.Services;
using KarlBot.DataModels.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KarlBot.Controllers
{
    /// <summary>
    /// REST API controller with endpoints related to authentication.
    /// </summary>
    [AllowAnonymous]
    [ApiController]
    [Route("Api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IFirebaseAuthenticationService _firebaseAuthenticationService;
        private readonly IFirebaseSignInService _firebaseSignInService;
        private readonly IUserTokenService _userTokenService;

        /// <summary>
        /// Initializes a new controller instance.
        /// </summary>
        public AuthenticationController(IFirebaseAuthenticationService firebaseAuthenticationService, IFirebaseSignInService firebaseSignInService, IUserTokenService userTokenService)
        {
            _firebaseAuthenticationService = firebaseAuthenticationService;
            _firebaseSignInService = firebaseSignInService;
            _userTokenService = userTokenService;
        }

        /// <summary>
        /// Authenticates user with Firebase and returns his token.
        /// </summary>
        /// <param name="request">Firebase authentication request.</param>
        /// <response code="401">Invalid Firebase ID token.</response>
        [HttpPost("Firebase")]
        public async Task<ActionResult<FirebaseResponse>> FirebaseAsync(FirebaseRequest request)
        {
            var firebaseUser = await _firebaseAuthenticationService.VerifyIdTokenAsync(request.FirebaseIdToken);
            if (firebaseUser == null)
                return Unauthorized();

            var user = await _firebaseSignInService.SignInAsync(firebaseUser);

            var token = await _userTokenService.CreateTokenAsync(user);
            return new FirebaseResponse
            {
                Token = token
            };
        }
    }
}