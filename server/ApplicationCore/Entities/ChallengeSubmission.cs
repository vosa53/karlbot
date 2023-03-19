using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationCore.Entities
{
    public class ChallengeSubmission
    {
        public int Id { get; set; }
        public int ChallengeId { get; set; }
        public Challenge? Challenge { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public string ProjectFile { get; set; }
        public ChallengeSubmissionEvaluationResult? EvaluationResult { get; set; }

        public ChallengeSubmission(int challengeId, string userId, string projectFile)
        {
            ChallengeId = challengeId;
            UserId = userId;
            ProjectFile = projectFile;
        }
    }
}
