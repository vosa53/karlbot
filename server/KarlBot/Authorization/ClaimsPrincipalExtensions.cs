using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Security.Claims;

namespace KarlBot.Authorization
{
    public static class ClaimsPrincipalExtensions
    {
        public static Guid GetId(this ClaimsPrincipal claimsPrincipal)
        {
            var id = GetIdOrNull(claimsPrincipal);
            if (!id.HasValue)
                throw new Exception();

            return id.Value;
        }

        public static Guid? GetIdOrNull(this ClaimsPrincipal claimsPrincipal)
        {
            var nameIdentifier = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
            if (nameIdentifier == null)
                return null;

            return Guid.Parse(nameIdentifier);
        }
    }
}
