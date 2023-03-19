using ApplicationCore.Entities;

namespace KarlBot.DataModels.Challenges
{
    public class ChallengeSubmissionDataModel
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string ProjectFile { get; set; }
        public ChallengeSubmissionEvaluationResultDataModel? EvaluationResult { get; set; }
    }
}
