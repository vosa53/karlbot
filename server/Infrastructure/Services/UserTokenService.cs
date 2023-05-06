using ApplicationCore.Entities;
using ApplicationCore.Repositories;
using ApplicationCore.Services;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Infrastructure.Services
{
    /// <summary>
    /// Service to issue tokens for users.
    /// </summary>
    public class UserTokenService : IUserTokenService
    {
        private readonly UserTokenOptions _options;
        private readonly IUserRepository _userRepository;

        /// <param name="options">Options.</param>
        /// <param name="userManager">User manager.</param>
        public UserTokenService(IOptions<UserTokenOptions> options, IUserRepository userRepository)
        {
            _options = options.Value;
            _userRepository = userRepository;
        }

        /// <inheritdoc/>
        public async Task<string> CreateTokenAsync(User user)
        {
            var roles = await _userRepository.GetRolesAsync(user.Id);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };
            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            var key = Encoding.ASCII.GetBytes(_options.Key);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = _options.Issuer,
                Audience = _options.Audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature),
                Expires = DateTime.UtcNow.AddMinutes(_options.LifetimeMinutes),
                Subject = new ClaimsIdentity(claims)
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
