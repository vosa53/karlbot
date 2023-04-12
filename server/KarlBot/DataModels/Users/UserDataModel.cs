using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Users
{
    /// <summary>
    /// User.
    /// </summary>
    public class UserDataModel
    {
        /// <summary>
        /// ID.
        /// </summary>
        public required Guid Id { get; init; }

        /// <summary>
        /// Email.
        /// </summary>
        [Required]
        public required string Email { get; init; }

        /// <summary>
        /// Whether the user is admin.
        /// </summary>
        public required bool IsAdmin { get; init; }
    }
}
