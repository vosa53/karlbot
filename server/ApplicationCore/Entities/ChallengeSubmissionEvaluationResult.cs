using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationCore.Entities
{
    /// <summary>
    /// Evaluation result of challenge submission.
    /// </summary>
    /// <param name="SuccessRate">Success ratio. Must be between 0 and 1.</param>
    /// <param name="Message">Message further descripting the result.</param>
    public record ChallengeSubmissionEvaluationResult(double SuccessRate, string Message);
}
