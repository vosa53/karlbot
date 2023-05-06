using ApplicationCore.Entities;
using ApplicationCore.Services;
using Microsoft.ClearScript;
using Microsoft.ClearScript.V8;
using Microsoft.CSharp.RuntimeBinder;
using Microsoft.Extensions.Options;
using System.Text.Json;

namespace Infrastructure.Services
{
    /// <summary>
    /// Challenge evaluation service using JavaScript execution library <see href="https://github.com/microsoft/ClearScript">ClearScript</see>.
    /// </summary>
    public class ClearScriptChallengeEvaluationService : IChallengeEvaluationService
    {
        private readonly ClearScriptChallengeEvaluationServiceOptions _options;

        /// <param name="options">Options.</param>
        public ClearScriptChallengeEvaluationService(IOptions<ClearScriptChallengeEvaluationServiceOptions> options)
        {
            _options = options.Value;
        }

        /// <inheritdoc/>
        public async Task<ChallengeEvaluationResult> EvaluateAsync(string projectFile, IList<ChallengeTestCase> testCases)
        {
            using var engine = new V8ScriptEngine();
            try
            {
                return await EvaluateInternalAsync(engine, projectFile, testCases);
            }
            catch (ScriptEngineException exception)
            {
                throw CreateEvaluationScriptErrorException(exception.ScriptException, exception);
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

            try
            {
                var resultPromise = engine.Script.karelEvaluation.evaluate(projectFile, JsonSerializer.Serialize(evaluationScriptTestCases));
                resultPromise.then(resolveHandler, rejectHandler);
            }
            catch (RuntimeBinderException exception)
            {
                throw new Exception("Can not find a function with name 'evaluate' returning a Promise.", exception);
            }

            return taskCompletionSource.Task;
        }

        private Exception CreateEvaluationScriptErrorException(dynamic scriptError, Exception? innerException = null)
        {
            var errorMessage = scriptError.stack;
            return new Exception("Error in challenge evaluation script: " + errorMessage, innerException);
        }
    }
}
