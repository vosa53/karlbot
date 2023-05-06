namespace ApplicationCore.Entities
{
    /// <summary>
    /// Challenge.
    /// </summary>
    public class Challenge
    {
        /// <summary>
        /// ID.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Difficulty.
        /// </summary>
        public ChallengeDifficulty Difficulty { get; set; }

        /// <summary>
        /// Test cases.
        /// </summary>
        public IList<ChallengeTestCase>? TestCases { get; set; }

        /// <summary>
        /// Submissions.
        /// </summary>
        public IList<ChallengeSubmission>? Submissions { get; set; }

        /// <param name="name">Name.</param>
        /// <param name="description">Description.</param>
        /// <param name="difficulty">Difficulty.</param>
        /// <param name="testCases">Test cases.</param>
        public Challenge(string name, string description, ChallengeDifficulty difficulty, IList<ChallengeTestCase>? testCases)
        {
            Name = name;
            Description = description;
            Difficulty = difficulty;
            TestCases = testCases;
        }

        private Challenge()
        {
        }
    }
}
