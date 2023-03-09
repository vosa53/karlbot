using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationCore.Entities
{
    public class ChallengeSubmision
    {
        public int Id { get; init; }
        public int ChallengeId { get; init; }
        public Challenge Challenge { get; init; }
        public int UserId { get; init; }
        public User User { get; init; }
        public string ProjectFile { get; init; }
        public ChallengeSubmissionEvaluationState EvaluationState { get; init; }
        public string EvaluationMessage { get; init; }
    }
}
