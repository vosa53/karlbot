using ApplicationCore.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Tests
{
    /// <summary>
    /// Base class for database integration tests. Contains test data and initializes the database with them.
    /// </summary>
    public class DatabaseTest
    {
        public Guid Guid1 { get; }
        public Guid Guid2 { get; }
        public Guid Guid3 { get; }
        public Guid Guid4 { get; }
        public Guid NotUsedGuid { get; }
        public DateTime DateTime1 { get; }
        public DateTime DateTime2 { get; }
        public Challenge Challenge1 { get; }
        public Challenge Challenge2 { get; }
        public ChallengeSubmission ChallengeSubmission1 { get; }
        public ChallengeSubmission ChallengeSubmission2 { get; }
        public ChallengeSubmission ChallengeSubmission3 { get; }
        public ChallengeSubmission ChallengeSubmission4 { get; }
        public ChallengeTestCase ChallengeTestCase1 { get; }
        public ChallengeTestCase ChallengeTestCase2 { get; }
        public Project Project1 { get; }
        public Project Project2 { get; }
        public User User1 { get; }
        public User User2 { get; }
        public IdentityRole<Guid> Role1 { get; }
        public IdentityRole<Guid> Role2 { get; }
        public IdentityRole<Guid> Role3 { get; }

        private static readonly object _initializeLock = new();
        private static bool _databaseInitialized;

        /// <summary>
        /// Initializes the database with test data.
        /// </summary>
        public DatabaseTest()
        {
            Guid1 = new Guid(new string('1', 32));
            Guid2 = new Guid(new string('2', 32));
            Guid3 = new Guid(new string('3', 32));
            Guid4 = new Guid(new string('4', 32));
            NotUsedGuid = new Guid(new string('f', 32));
            DateTime1 = DateTime.FromFileTimeUtc(65464563);
            DateTime1 = DateTime.FromFileTimeUtc(86511313);

            Challenge1 = new Challenge("challenge1", "description1", ChallengeDifficulty.Easy, new List<ChallengeTestCase>()) { Id = Guid1 };
            Challenge2 = new Challenge("challenge2", "description2", ChallengeDifficulty.Hard, new List<ChallengeTestCase>()) { Id = Guid2 };
            ChallengeSubmission1 = new ChallengeSubmission(Guid1, Guid1, DateTime1, "project1", 1, "") { Id = Guid1 };
            ChallengeSubmission2 = new ChallengeSubmission(Guid1, Guid1, DateTime2, "project2", 0.5, "error") { Id = Guid2 };
            ChallengeSubmission3 = new ChallengeSubmission(Guid1, Guid2, DateTime1, "project3", 1, "") { Id = Guid3 };
            ChallengeSubmission4 = new ChallengeSubmission(Guid2, Guid2, DateTime1, "project3", 0.3, "another error") { Id = Guid4 };
            ChallengeTestCase1 = new ChallengeTestCase("input1", "output1", false, true, false, true) { Id = Guid1, ChallengeId = Guid1 };
            ChallengeTestCase2 = new ChallengeTestCase("input2", "output2", true, true, false, false) { Id = Guid2, ChallengeId = Guid1 };
            Project1 = new Project(Guid1, DateTime1, "project1") { Id = Guid1 };
            Project2 = new Project(Guid2, DateTime2, "project2") { Id = Guid2 };
            User1 = new User("aaa@bbb.ccc") { Id = Guid1 };
            User2 = new User("ddd@eee.fff") { Id = Guid2 };
            Role1 = new IdentityRole<Guid>("Role1") { Id = Guid1 };
            Role2 = new IdentityRole<Guid>("Role2") { Id = Guid2 };
            Role3 = new IdentityRole<Guid>("Role3") { Id = Guid3 };
            var user1Role1 = new IdentityUserRole<Guid> { UserId = Guid1, RoleId = Guid1 };
            var user2Role2 = new IdentityUserRole<Guid> { UserId = Guid2, RoleId = Guid2 };
            var user2Role3 = new IdentityUserRole<Guid> { UserId = Guid2, RoleId = Guid3 };

            // From: https://learn.microsoft.com/en-us/ef/core/testing/testing-with-the-database.
            lock (_initializeLock)
            {
                if (!_databaseInitialized)
                {
                    using var dbContext = CreateDbContext();
                    dbContext.Database.EnsureDeleted();
                    dbContext.Database.EnsureCreated();

                    dbContext.AddRange(Challenge1, Challenge2, ChallengeSubmission1, ChallengeSubmission2, ChallengeSubmission3,
                        ChallengeSubmission4, ChallengeTestCase1, ChallengeTestCase2, Project1, Project2, User1, User2, Role1,
                        Role2, Role3, user1Role1, user2Role2, user2Role3);
                    dbContext.SaveChanges();

                    _databaseInitialized = true;
                }
            }
        }

        /// <summary>
        /// Creates a new DbContext for database integration test.
        /// </summary>
        protected ApplicationDbContext CreateDbContext()
        {
            var connectionString = TestsConfiguration.Configuration.GetConnectionString("DefaultConnection");
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                    .UseSqlServer(connectionString)
                    .Options;
            return new ApplicationDbContext(options);
        }
    }
}
