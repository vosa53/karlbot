using Microsoft.ClearScript.V8;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure
{
    public class ChallengeEvaluator
    {
        public ChallengeEvaluatorResult Evaluate(string evaluationCode, string townFile)
        {
            var karelLibrary = File.ReadAllText(@"C:\Users\janjo\Desktop\karlbot\client\projects\karel\dist");

            var engine = new V8ScriptEngine();
            engine.Evaluate(karelLibrary);
            var result = engine.Evaluate(evaluationCode);

            return null;
        }   
    }

    public record ChallengeEvaluatorResult(bool success, string message)
    {
        
    }
}
