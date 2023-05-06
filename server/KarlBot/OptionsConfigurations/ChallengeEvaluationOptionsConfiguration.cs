using Infrastructure.Services;
using Microsoft.Extensions.Options;

namespace KarlBot.OptionsConfigurations
{
    /// <summary>
    /// Configures <see cref="ClearScriptChallengeEvaluationServiceOptions"/>. 
    /// Loads source code of JavaScript libraries from the specified file paths.
    /// </summary>
    public class ChallengeEvaluationOptionsConfiguration : IConfigureOptions<ClearScriptChallengeEvaluationServiceOptions>
    {
        private readonly IConfiguration _configuration;

        /// <param name="configuration">Configuration.</param>
        public ChallengeEvaluationOptionsConfiguration(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <inheritdoc/>
        public void Configure(ClearScriptChallengeEvaluationServiceOptions options)
        {
            var challengeEvaluationConfiguration = _configuration.GetSection("ChallengeEvaluation");
            var karelLibraryPath = challengeEvaluationConfiguration.GetValue<string>("KarelLibraryPath");
            var karelEvaluationLibraryPath = challengeEvaluationConfiguration.GetValue<string>("KarelEvaluationLibraryPath");

            if (karelLibraryPath == null || karelEvaluationLibraryPath == null)
                throw new Exception("Path to Karel or Karel evaluation JavaScript library was not specified in the configuration.");

            options.KarelLibrarySource = File.ReadAllText(karelLibraryPath);
            options.KarelEvaluationLibrarySource = File.ReadAllText(karelEvaluationLibraryPath);
        }
    }
}
