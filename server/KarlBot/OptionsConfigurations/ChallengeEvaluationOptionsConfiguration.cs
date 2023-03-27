using Infrastructure.Services;
using Microsoft.Extensions.Options;

namespace KarlBot.OptionsConfigurations
{
    public class ChallengeEvaluationOptionsConfiguration : IConfigureOptions<ChallengeEvaluationOptions>
    {
        private readonly IConfiguration _configuration;

        public ChallengeEvaluationOptionsConfiguration(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void Configure(ChallengeEvaluationOptions options)
        {
            var challengeEvaluationConfiguration = _configuration.GetSection("ChallengeEvaluation");
            var karelLibraryPath = challengeEvaluationConfiguration.GetValue<string>("KarelLibraryPath");
            var karelEvaluationLibraryPath = challengeEvaluationConfiguration.GetValue<string>("KarelEvaluationLibraryPath");

            if (karelLibraryPath == null || karelEvaluationLibraryPath == null)
                throw new Exception();


            options.KarelLibrarySource = File.ReadAllText(karelLibraryPath);
            options.KarelEvaluationLibrarySource = File.ReadAllText(karelEvaluationLibraryPath);
        }
    }
}
