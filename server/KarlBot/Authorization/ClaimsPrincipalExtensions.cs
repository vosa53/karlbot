using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Security.Claims;

namespace KarlBot.Authorization
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetId(this ClaimsPrincipal claimsPrincipal)
        {
            var id = GetIdOrNull(claimsPrincipal);
            if (id == null)
                throw new Exception();

            return id;
        }

        public static string? GetIdOrNull(this ClaimsPrincipal claimsPrincipal)
        {
            return claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
        }
    }
}
