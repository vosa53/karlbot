using ApplicationCore.Entities;
using KarlBot.DataModels.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace KarlBot.Controllers
{
    /// <summary>
    /// REST API controller with endpoints related to users.
    /// </summary>
    [Route("Api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        /// <summary>
        /// Initializes a new controller instance.
        /// </summary>
        public UsersController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        /// <summary>
        /// Returns the currently authenticated user.
        /// </summary>
        [HttpGet("current")]
        public async Task<ActionResult<UserDataModel>> GetCurrentAsync()
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
                throw new UnreachableException();

            return new UserDataModel
            {
                Id = user.Id,
                Email = user.Email!,
                IsAdmin = User.IsInRole(RoleNames.Admin)
            };
        }
    }
}
