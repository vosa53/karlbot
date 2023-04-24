using ApplicationCore.Entities;
using Infrastructure.Repositories;
using NUnit.Framework.Constraints;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Tests.Repositories
{
    public class DbContextChallengeRepositoryTests : DbContextRepositoryTests<Challenge, Guid>
    {
        protected override DbContextRepository<Challenge, Guid> CreateRepository(ApplicationDbContext dbContext) =>
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
