using Microsoft.ClearScript.JavaScript;
using Microsoft.ClearScript;
using Microsoft.ClearScript.V8;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FirebaseAdmin.Messaging;
using ApplicationCore.Entities;
using System.Text.Json;
using ApplicationCore;
using ApplicationCore.Services;
using Microsoft.Extensions.Options;

namespace Infrastructure.Services
{
    public class ChallengeEvaluationService : IChallengeEvaluationService
    {
        private readonly ChallengeEvaluationOptions _options;

        public ChallengeEvaluationService(IOptions<ChallengeEvaluationOptions> options)
        {
            _options = options.Value;
        }

        public async Task<ChallengeEvaluationResult> EvaluateAsync(string projectFile, IList<ChallengeTestCase> testCases)
        {
            using var engine = new V8ScriptEngine();
            try
            {
                return await EvaluateInternalAsync(engine, projectFile, testCases);
            }
            catch (ScriptEngineException exception)
            {
                throw CreateEvaluationScriptErrorException(exception.ScriptException);
            }
        }

        private Task<ChallengeEvaluationResult> EvaluateInternalAsync(V8ScriptEngine engine, string projectFile, IList<ChallengeTestCase> testCases)
        {
            engine.Evaluate(_options.KarelLibrarySource);
            engine.Evaluate(_options.KarelEvaluationLibrarySource);

            var taskCompletionSource = new TaskCompletionSource<ChallengeEvaluationResult>();

            Action<dynamic> resolveHandler = r =>
            {
                var successRate = r.successRate;
                var message = r.message;
                var result = new ChallengeEvaluationResult(successRate, message);
                taskCompletionSource.SetResult(result);
            };

            Action<dynamic> rejectHandler = e =>
            {
                taskCompletionSource.SetException(CreateEvaluationScriptErrorException(e));
            };

            var evaluationScriptTestCases = testCases.Select(tc => new
            {
                inputTown = tc.InputTown,
                outputTown = tc.OutputTown,
                checkKarelPosition = tc.CheckKarelPosition,
                checkKarelDirection = tc.CheckKarelDirection,
                checkSigns = tc.CheckSigns
            }).ToArray();

            var resultPromise = engine.Script.karelEvaluation.evaluate(projectFile, JsonSerializer.Serialize(evaluationScriptTestCases));
            resultPromise.then(resolveHandler, rejectHandler);

            return taskCompletionSource.Task;
        }

        private Exception CreateEvaluationScriptErrorException(dynamic scriptError)
        {
            var errorMessage = scriptError.stack;
            return new Exception("Error in challenge evaluation script: " + errorMessage);
        }
    }
}
