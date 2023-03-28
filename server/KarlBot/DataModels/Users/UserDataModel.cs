using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Users
{
    public class UserDataModel
    {
        [StringLength(36, MinimumLength = 36)]
        public required string Id { get; init; }
        public required string Email { get; init; }
        public required bool IsAdmin { get; init; }
    }
}
