using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Authentication
{
    /// <summary>
    /// Firebase authentication response.
    /// </summary>
    public class FirebaseResponse
    {
        /// <summary>
        /// User token.
        /// </summary>
        [Required]
        public required string Token { get; init; }
    }
}
