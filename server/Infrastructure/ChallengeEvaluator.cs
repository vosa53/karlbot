using Microsoft.ClearScript.JavaScript;
using Microsoft.ClearScript;
using Microsoft.ClearScript.V8;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FirebaseAdmin.Messaging;

namespace Infrastructure
{
    public class ChallengeEvaluator
    {
        private static readonly string KAREL_LIBRARY = File.ReadAllText(@"C:\Users\janjo\Desktop\karlbot\client\projects\karel\dist\bundle.js");
        private static readonly string KAREL_EVALUATION_LIBRARY = File.ReadAllText(@"C:\Users\janjo\Desktop\karlbot\client\projects\karel-evaluation\dist\bundle.js");

        public async Task<ChallengeEvaluationResult> EvaluateAsync(string projectFile, string evaluationCode)
        {
            return await EvaluateLoopingProtectionAsync(projectFile, evaluationCode);
        }

        private async Task<ChallengeEvaluationResult> EvaluateLoopingProtectionAsync(string projectFile, string evaluationCode)
        {
            var scriptCancellationTokenSource = new CancellationTokenSource();
            var timeoutCancellationTokenSource = new CancellationTokenSource();
            Task.Delay(3000, timeoutCancellationTokenSource.Token).ContinueWith((t) =>
            {
                scriptCancellationTokenSource.Cancel();
            });

            try
            {
                var result = await EvaluateErrorProtectionAsync(projectFile, evaluationCode, scriptCancellationTokenSource.Token);
                timeoutCancellationTokenSource.Cancel();
                return result;
            }
            catch (ScriptInterruptedException exception)
            {
                return new ChallengeEvaluationResult(ChallengeEvaluationResultType.SystemError, "Timeout");
            }
        }

        private async Task<ChallengeEvaluationResult> EvaluateErrorProtectionAsync(string projectFile, string evaluationCode, CancellationToken cancellationToken)
        {
            try
            {
                return await EvaluateInternalAsync(projectFile, evaluationCode, cancellationToken);
            }
            catch (ScriptEngineException exception)
            {
                return new ChallengeEvaluationResult(ChallengeEvaluationResultType.SystemError, exception.ScriptException.stack);
            }
        }

        private Task<ChallengeEvaluationResult> EvaluateInternalAsync(string projectFile, string evaluationCode, CancellationToken cancellationToken)
        {
            var engine = new V8ScriptEngine();

            var wasDisposed = false;
            var disposeEngineLock = new object();
            void StopAndDisposeEngine()
            {
                lock (disposeEngineLock)
                {
                    if (!wasDisposed)
                    {
                        engine.Interrupt();
                        engine.Dispose();
                        wasDisposed = true;
                    }
                }
            }

            cancellationToken.Register(() => StopAndDisposeEngine());

            engine.Evaluate(KAREL_LIBRARY);
            engine.Evaluate(KAREL_EVALUATION_LIBRARY);
            engine.Evaluate(evaluationCode);

            var taskCompletionSource = new TaskCompletionSource<ChallengeEvaluationResult>();

            Action<dynamic> resolveHandler = r =>
            {
                var isSuccess = r.success;
                var message = r.message;
                var result = new ChallengeEvaluationResult(isSuccess ? ChallengeEvaluationResultType.Success : ChallengeEvaluationResultType.Failure, message);
                StopAndDisposeEngine();
                taskCompletionSource.SetResult(result);
            };

            Action<dynamic> rejectHandler = e =>
            {
                var errorMessage = e.stack;
                var result = new ChallengeEvaluationResult(ChallengeEvaluationResultType.SystemError, errorMessage);
                StopAndDisposeEngine();
                taskCompletionSource.SetResult(result);
            };

            var resultPromise = engine.Script.karelEvaluation._evaluate(projectFile);
            resultPromise.then(resolveHandler, rejectHandler);

            return taskCompletionSource.Task;
        }
    }

    public record ChallengeEvaluationResult(ChallengeEvaluationResultType type, string message);

    public enum ChallengeEvaluationResultType
    {
        Success,
        Failure,
        SystemError
    }
}
