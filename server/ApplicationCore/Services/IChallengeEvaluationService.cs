using ApplicationCore.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationCore.Services
{
    /// <summary>
    /// Service to evaluate challenge submissions.
    /// </summary>
    public interface IChallengeEvaluationService
    {
        /// <summary>
        /// Evaluates the given test cases on the given project.
        /// </summary>
        /// <param name="projectFile">Project file.</param>
        /// <param name="testCases">Test cases.</param>
        /// <returns>Evaluation result.</returns>
        Task<ChallengeEvaluationResult> EvaluateAsync(string projectFile, IList<ChallengeTestCase> testCases);
    }

    /// <summary>
    /// Result of challenge evaluation.
    /// </summary>
    /// <param name="SuccessRate">Success ratio. Must be between 0 and 1.</param>
    /// <param name="Message">Message further descripting the result.</param>
    public record ChallengeEvaluationResult(double SuccessRate, string Message);
}
