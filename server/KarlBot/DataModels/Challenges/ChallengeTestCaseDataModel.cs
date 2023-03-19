namespace KarlBot.DataModels.Challenges
{
    public class ChallengeTestCaseDataModel
    {
        public string InputTown { get; set; }
        public string OutputTown { get; set; }
        public bool CheckKarelPosition { get; set; }
        public bool CheckKarelDirection { get; set; }
        public bool CheckSigns { get; set; }
        public bool IsPublic { get; set; }
    }
}
