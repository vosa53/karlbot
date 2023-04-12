using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Security.Claims;

namespace KarlBot.Authorization
{
    /// <summary>
    /// Extension methods for <see cref="ClaimsPrincipal"/>.
    /// </summary>
    public static class ClaimsPrincipalExtensions
    {
        /// <summary>
        /// Returns the user ID.
        /// </summary>
        /// <exception cref="Exception">Thrown when the id is not present.</exception>
        /// <exception cref="FormatException">Thrown when the ID can not be parsed to GUID.</exception>
        public static Guid GetId(this ClaimsPrincipal claimsPrincipal)
        {
            var id = GetIdOrNull(claimsPrincipal);
            if (!id.HasValue)
                throw new Exception();

            return id.Value;
        }

        /// <summary>
        /// Returns the user ID or null if ID is not present.
        /// </summary>
        /// <exception cref="FormatException">Thrown when the ID can not be parsed to GUID.</exception>
        public static Guid? GetIdOrNull(this ClaimsPrincipal claimsPrincipal)
        {
            var nameIdentifier = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
            if (nameIdentifier == null)
                return null;

            return Guid.Parse(nameIdentifier);
        }
    }
}
