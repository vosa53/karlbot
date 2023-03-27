using ApplicationCore.Entities;
using ApplicationCore.Repositories;
using ApplicationCore.Services;
using Infrastructure.Services;
using KarlBot.DataModels.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.WebSockets;
using System.Security.Claims;
using System.Text;

namespace KarlBot.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IFirebaseAuthenticationService _firebaseAuthenticationService;
        private readonly UserManager<User> _userManager;
        private readonly IUserTokenService _userTokenService;

        public AuthenticationController(IFirebaseAuthenticationService firebaseAuthenticationService, UserManager<User> userManager, IUserTokenService userTokenService)
        {
            _firebaseAuthenticationService = firebaseAuthenticationService;
            _userManager = userManager;
            _userTokenService = userTokenService;
        }

        [HttpPost("Firebase")]
        public async Task<ActionResult<FirebaseResponse>> FirebaseAsync(FirebaseRequest request)
        {
            var firebaseUser = await _firebaseAuthenticationService.VerifyIdTokenAsync(request.FirebaseIdToken);
            if (firebaseUser == null)
                return Unauthorized();

            var user = await _userManager.FindByLoginAsync("Firebase", firebaseUser.Uid);
            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(firebaseUser.Email);

                if (user == null)
                {
                    user = new User(firebaseUser.Email);
                    var result = await _userManager.CreateAsync(user);
                    if (!result.Succeeded)
                        throw new Exception();
                    var userLoginInfo = new UserLoginInfo("Firebase", firebaseUser.Uid, null);
                    await _userManager.AddLoginAsync(user, userLoginInfo);
                }
            }

            var token = await _userTokenService.CreateTokenAsync(user);
            return new FirebaseResponse
            {
                Token = token
            };
        }
    }
}