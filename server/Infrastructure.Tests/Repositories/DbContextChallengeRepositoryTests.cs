using ApplicationCore.Entities;
using Infrastructure.Repositories;

namespace Infrastructure.Tests.Repositories
{
    public class DbContextChallengeRepositoryTests : DbContextRepositoryTests<Challenge, Guid>
    {
        [Test]
        public async Task GetWithSubmissionsInfo()
        {
            using var dbContext = CreateDbContext();
            var repository = CreateRepository(dbContext);

            var actual = await repository.GetWithSubmissionsInfoAsync(Guid1);

            Assert.That(actual.Count, Is.EqualTo(2));
            AssertEquals(Challenge1, actual[0].Challenge);
            Assert.That(actual[0].OwnSuccessfulSubmissionCount, Is.EqualTo(1));
            Assert.That(actual[0].OwnSubmissionCount, Is.EqualTo(2));
            Assert.That(actual[0].UsersSuccessfullySubmittedCount, Is.EqualTo(2));
            Assert.That(actual[0].UsersSubmittedCount, Is.EqualTo(2));
            AssertEquals(Challenge2, actual[1].Challenge);
            Assert.That(actual[1].OwnSuccessfulSubmissionCount, Is.EqualTo(0));
            Assert.That(actual[1].OwnSubmissionCount, Is.EqualTo(0));
            Assert.That(actual[1].UsersSuccessfullySubmittedCount, Is.EqualTo(0));
            Assert.That(actual[1].UsersSubmittedCount, Is.EqualTo(1));
        }

        [Test]
        public async Task GetByIdWithSubmissionsInfo()
        {
            using var dbContext = CreateDbContext();
            var repository = CreateRepository(dbContext);

            var actual = await repository.GetByIdWithSubmissionsInfoAsync(Guid1, Guid2);

            Assert.NotNull(actual);
            AssertEquals(Challenge1, actual.Challenge);
            Assert.That(actual.OwnSuccessfulSubmissionCount, Is.EqualTo(1));
            Assert.That(actual.OwnSubmissionCount, Is.EqualTo(1));
            Assert.That(actual.UsersSuccessfullySubmittedCount, Is.EqualTo(2));
            Assert.That(actual.UsersSubmittedCount, Is.EqualTo(2));
        }

        protected override DbContextChallengeRepository CreateRepository(ApplicationDbContext dbContext) =>
            new DbContextChallengeRepository(dbContext);

        protected override void AssertEquals(Challenge expected, Challenge actual)
        {
            Assert.That(actual.Id, Is.EqualTo(expected.Id));
            Assert.That(actual.Name, Is.EqualTo(expected.Name));
            Assert.That(actual.Description, Is.EqualTo(expected.Description));
            Assert.That(actual.Difficulty, Is.EqualTo(expected.Difficulty));
        }

        protected override Challenge CreateEntity() => new Challenge("new challenge", "some description", ChallengeDifficulty.Medium, new List<ChallengeTestCase>());

        protected override void UpdateEntity(Challenge entity) => entity.Description = "Some updated description";

        protected override IList<Challenge> GetAllEntities() => new[] { Challenge1, Challenge2 };

        protected override Guid GetEntityId(Challenge entity) => entity.Id;

        protected override Guid GetNotUsedEntityId() => NotUsedGuid;
    }
}
