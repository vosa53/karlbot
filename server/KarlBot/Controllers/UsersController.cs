using ApplicationCore.Entities;
using KarlBot.DataModels.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace KarlBot.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public UsersController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet("current")]
        public async Task<ActionResult<UserDataModel>> GetCurrentUserAsync()
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
                throw new Exception();

            return new UserDataModel
            {
                Id = user.Id,
                Email = user.Email!
            };
        }
    }
}
