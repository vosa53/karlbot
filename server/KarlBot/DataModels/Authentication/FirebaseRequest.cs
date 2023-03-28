using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Authentication
{
    public class FirebaseRequest
    {
        [StringLength(10_000)]
        public required string FirebaseIdToken { get; init; }
    }
}
