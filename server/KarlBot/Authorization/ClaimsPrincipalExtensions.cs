using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Security.Claims;

namespace KarlBot.Authorization
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetId(this ClaimsPrincipal claimsPrincipal)
        {
            var id = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
            if (id == null)
                throw new Exception();

            return id;
        }
    }
}
