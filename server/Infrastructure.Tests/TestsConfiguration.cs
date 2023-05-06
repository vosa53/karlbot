using Microsoft.Extensions.Configuration;

namespace Infrastructure.Tests
{
    /// <summary>
    /// Provides access to tests configuration.
    /// </summary>
    internal class TestsConfiguration
    {
        /// <summary>
        /// Tests configuration from <c>appsettings.json</c> and environment variables. Environment variables have higher precedence.
        /// </summary>
        public static IConfigurationRoot Configuration { get; } = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .AddEnvironmentVariables()
            .Build();
    }
}
