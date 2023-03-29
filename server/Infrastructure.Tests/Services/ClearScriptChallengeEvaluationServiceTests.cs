using ApplicationCore.Entities;
using Infrastructure.Services;
using Microsoft.Extensions.Options;

namespace Infrastructure.Tests.Services
{
    public class ClearScriptChallengeEvaluationServiceTests
    {
        [Test]
        public async Task Evaluate_ReturnsResultFromEvaluationScript()
        {
            var serviceOptions = Options.Create(new ClearScriptChallengeEvaluationServiceOptions
            {
                KarelLibrarySource = "",
                KarelEvaluationLibrarySource = CreateEvaluateFunctionSource("return { successRate: 0.25, message: 'Some message' };")
            });
            var service = new ClearScriptChallengeEvaluationService(serviceOptions);

            var result = await service.EvaluateAsync("", Array.Empty<ChallengeTestCase>());

            Assert.That(result.SuccessRate, Is.EqualTo(0.25));
            Assert.That(result.Message, Is.EqualTo("Some message"));
        }

        [Test]
        public async Task Evaluate_PassesProjectFileToEvaluationScript()
        {
            var serviceOptions = Options.Create(new ClearScriptChallengeEvaluationServiceOptions
            {
                KarelLibrarySource = "",
                KarelEvaluationLibrarySource = CreateEvaluateFunctionSource("return { successRate: 0, message: 'Received: ' + projectFile };")
            });
            var service = new ClearScriptChallengeEvaluationService(serviceOptions);

            var result = await service.EvaluateAsync("Some project file", Array.Empty<ChallengeTestCase>());

            Assert.That(result.Message, Is.EqualTo("Received: Some project file"));
        }

        [Test]
        public async Task Evaluate_PassesTestCasesToEvaluationScript()
        {
            var serviceOptions = Options.Create(new ClearScriptChallengeEvaluationServiceOptions
            {
                KarelLibrarySource = "",
                KarelEvaluationLibrarySource = CreateEvaluateFunctionSource(@"
const tc = JSON.parse(testCasesJSON);
const message = tc.length + 
    tc[0].inputTown + tc[0].outputTown + tc[0].checkKarelPosition + tc[0].checkKarelDirection + tc[0].checkSigns + '|' + 
    tc[1].inputTown + tc[1].outputTown + tc[1].checkKarelPosition + tc[1].checkKarelDirection + tc[1].checkSigns;
return { successRate: 0, message };
")
            });
            var service = new ClearScriptChallengeEvaluationService(serviceOptions);
            var testCases = new ChallengeTestCase[]
            {
                new ChallengeTestCase("input1", "output1", true, false, false, false),
                new ChallengeTestCase("input2", "output2", false, true, true, true)
            };

            var result = await service.EvaluateAsync("", testCases);

            Assert.That(result.Message, Is.EqualTo("2input1output1truefalsefalse|input2output2falsetruetrue"));
        }

        [Test]
        public async Task Evaluate_AllowsUsingKarelLibraryFromKarelEvaluationLibrary()
        {
            var serviceOptions = Options.Create(new ClearScriptChallengeEvaluationServiceOptions
            {
                KarelLibrarySource = "var karel = { text: 'Some text' };",
                KarelEvaluationLibrarySource = CreateEvaluateFunctionSource("return { successRate: 0, message: karel.text };")
            });
            var service = new ClearScriptChallengeEvaluationService(serviceOptions);

            var result = await service.EvaluateAsync("", Array.Empty<ChallengeTestCase>());

            Assert.That(result.Message, Is.EqualTo("Some text"));
        }

        [Test]
        public void Evaluate_ThrowsExceptionWhenEvaluateFunctionIsMissing()
        {
            var serviceOptions = Options.Create(new ClearScriptChallengeEvaluationServiceOptions
            {
                KarelLibrarySource = "",
                KarelEvaluationLibrarySource = @"const x = 5;"
            });
            var service = new ClearScriptChallengeEvaluationService(serviceOptions);

            Assert.ThrowsAsync<Exception>(async () => await service.EvaluateAsync("", Array.Empty<ChallengeTestCase>()));
        }

        [Test]
        public void Evaluate_ThrowsExceptionWhenEvaluateFunctionThrowsError()
        {
            var serviceOptions = Options.Create(new ClearScriptChallengeEvaluationServiceOptions
            {
                KarelLibrarySource = "",
                KarelEvaluationLibrarySource = CreateEvaluateFunctionSource(@"const a = false; a.notExistingMethod();")
            });
            var service = new ClearScriptChallengeEvaluationService(serviceOptions);

            Assert.ThrowsAsync<Exception>(async () => await service.EvaluateAsync("", Array.Empty<ChallengeTestCase>()));
        }

        [Test]
        public void Evaluate_ThrowsExceptionWhenEvaluateFunctionThrowsErrorInPromise()
        {
            var serviceOptions = Options.Create(new ClearScriptChallengeEvaluationServiceOptions
            {
                KarelLibrarySource = "",
                KarelEvaluationLibrarySource = CreateEvaluateFunctionSource(@"return new Promise(() => { throw new Error(); });")
            });
            var service = new ClearScriptChallengeEvaluationService(serviceOptions);

            Assert.ThrowsAsync<Exception>(async () => await service.EvaluateAsync("", Array.Empty<ChallengeTestCase>()));
        }

        private string CreateEvaluateFunctionSource(string bodySource)
        {
            return $"async function evaluate(projectFile, testCasesJSON) {{ {bodySource} }} var karelEvaluation = {{ evaluate }};";
        }
    }
}