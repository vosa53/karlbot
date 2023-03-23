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
        public int Id { get; set; }

        /// <summary>
        /// Id of the challenge.
        /// </summary>
        public int ChallengeId { get; set; }

        /// <summary>
        /// Challenge.
        /// </summary>
        public Challenge? Challenge { get; set; }

        /// <summary>
        /// Id of the user who submitted it.
        /// </summary>
        public string UserId { get; set; }

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
        /// Evaluation result or `null` if it has not been evaluated yet.
        /// </summary>
        public ChallengeSubmissionEvaluationResult? EvaluationResult { get; set; }

        /// <param name="challengeId">Id of the challenge.</param>
        /// <param name="userId">Id of the user who submitted it.</param>
        /// <param name="created">Date and time of submission.</param>
        /// <param name="projectFile">Submitted project file.</param>
        public ChallengeSubmission(int challengeId, string userId, DateTime created, string projectFile)
        {
            ChallengeId = challengeId;
            UserId = userId;
            Created = created;
            ProjectFile = projectFile;
        }
    }
}
