using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Users
{
    public class UserDataModel
    {
        public required Guid Id { get; init; }
        public required string Email { get; init; }
        public required bool IsAdmin { get; init; }
    }
}
