using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Authentication
{
    /// <summary>
    /// Firebase authentication request.
    /// </summary>
    public class FirebaseRequest
    {
        /// <summary>
        /// Firebase ID token.
        /// </summary>
        [Required]
        [StringLength(10_000)]
        public required string FirebaseIdToken { get; init; }
    }
}
