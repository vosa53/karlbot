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
            var engine = new V8ScriptEngine();
        }
    }

    public record ChallengeEvaluatorResult(bool success, string message)
    {
        
    }
}
