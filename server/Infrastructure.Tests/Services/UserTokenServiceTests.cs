using ApplicationCore.Entities;
using ApplicationCore.Repositories;
using Infrastructure.Services;
using Infrastructure.Services.Options;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Moq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Infrastructure.Tests.Services
{
    public class UserTokenServiceTests
    {
        [Test]
        public async Task CreateToken_CreatesToken()
        {
            var serviceOptions = Options.Create(new UserTokenOptions
            {
                Issuer = "issuer",
                Audience = "audience",
                Key = "xxxxxxxxxxxxxxxx",
                LifetimeMinutes = 20
            });
            var user = new User("aaa@bbb.ccc") { Id = Guid.NewGuid() };
            var userRepositoryMock = new Mock<IUserRepository>();
            userRepositoryMock.Setup(um => um.GetRolesAsync(user.Id)).Returns(Task.FromResult<IList<string>?>(new[] { "FirstRole", "SecondRole" }));
            var service = new UserTokenService(serviceOptions, userRepositoryMock.Object);

            var token = await service.CreateTokenAsync(new User("aaa@bbb.ccc") { Id = user.Id });

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("xxxxxxxxxxxxxxxx"));
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidIssuer = "issuer",
                ValidAudience = "audience",
                IssuerSigningKey = key,
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var validatedToken);

            Assert.That(principal.FindFirstValue(ClaimTypes.NameIdentifier), Is.EqualTo(user.Id.ToString()));
            Assert.That(principal.FindAll(ClaimTypes.Role).Select(c => c.Value), Is.EquivalentTo(new[] { "FirstRole", "SecondRole" }));
        }
    }
}
