using System.ComponentModel.DataAnnotations;

namespace KarlBot.DataModels.Authentication
{
    public class FirebaseResponse
    {
        public required string Token { get; init; }
    }
}
