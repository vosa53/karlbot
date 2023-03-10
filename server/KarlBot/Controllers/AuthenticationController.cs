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
        private readonly ILogger<AuthenticationController> _logger;
        private readonly IConfiguration _config;
        private readonly IFirebaseAuthenticationService _firebaseAuthenticationService;
        private readonly IUserRepository _userRepository;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AuthenticationController(ILogger<AuthenticationController> logger, IConfiguration config, IFirebaseAuthenticationService firebaseAuthenticationService,
            IUserRepository userRepository, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            _logger = logger;
            _config = config;
            _firebaseAuthenticationService = firebaseAuthenticationService;
            _userRepository = userRepository;
            _userManager = userManager;
            _roleManager = roleManager;
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

            var roles = await _userManager.GetRolesAsync(user);

            return new FirebaseResponse
            {
                Token = CreateToken(user, roles)
            };
        }

        private string CreateToken(User user, IEnumerable<string> roles)
        {
            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];
            var key = Encoding.ASCII.GetBytes(_config["Jwt:Key"]);
            var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
                };
            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials
                (new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha512Signature)
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}