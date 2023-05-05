using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationCore.Entities
{
    /// <summary>
    /// Challenge submission.
    /// </summary>
    public class ChallengeSubmission
    {
        /// <summary>
        /// ID.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Id of the challenge.
        /// </summary>
        public Guid ChallengeId { get; set; }

        /// <summary>
        /// Challenge.
        /// </summary>
        public Challenge? Challenge { get; set; }

        /// <summary>
        /// Id of the user who submitted it.
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        /// User who submitted it.
        /// </summary>
        public User User { get; set; }

        /// <summary>
        /// Date and time of submission.
        /// </summary>
        public DateTime Created { get; set; }

        /// <summary>
        /// Submitted project file.
        /// </summary>
        public string ProjectFile { get; set; }

        /// <summary>
        /// Evaluation success ratio. Must be between 0 and 1.
        /// </summary>
        public double EvaluationSuccessRate { get; set; }

        /// <summary>
        /// Message further descripting the evaluation result.
        /// </summary>
        public string EvaluationMessage { get; set; }

        /// <param name="challengeId">Id of the challenge.</param>
        /// <param name="userId">Id of the user who submitted it.</param>
        /// <param name="created">Date and time of submission.</param>
        /// <param name="projectFile">Submitted project file.</param>
        /// <param name="evaluationSuccessRate">Evaluation success ratio. Must be between 0 and 1.</param>
        /// <param name="evaluationMessage">Message further descripting the evaluation result.</param>
        public ChallengeSubmission(Guid challengeId, Guid userId, DateTime created, string projectFile, double evaluationSuccessRate, string evaluationMessage)
        {
            ChallengeId = challengeId;
            UserId = userId;
            Created = created;
            ProjectFile = projectFile;
            EvaluationSuccessRate = evaluationSuccessRate;
            EvaluationMessage = evaluationMessage;
        }
    }
}
