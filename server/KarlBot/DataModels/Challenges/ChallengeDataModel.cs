namespace KarlBot.DataModels.Challenges
{
    public class ChallengeDataModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string? EvaluationCode { get; set; }
    }
}
