using ApplicationCore.Entities;

namespace KarlBot.DataModels.Challenges
{
    public class ChallengeSubmissionDataModel
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string ProjectFile { get; set; }
        public ChallengeSubmissionEvaluationState EvaluationState { get; set; }
        public string EvaluationMessage { get; set; }
    }
}
