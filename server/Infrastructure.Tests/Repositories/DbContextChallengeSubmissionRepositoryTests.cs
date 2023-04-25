using ApplicationCore.Entities;
using Infrastructure.Repositories;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Tests.Repositories
{
    public class DbContextChallengeSubmissionRepositoryTests : DbContextRepositoryTests<ChallengeSubmission, Guid>
    {
        [Test]
        public async Task Get_ReturnsChallengeSubmissionsByChallengeId()
        {
            using var dbContext = CreateDbContext();
            var repository = CreateRepository(dbContext);

            var actual = await repository.GetAsync(Guid1, null);

            Assert.That(actual.Count, Is.EqualTo(3));
            AssertEquals(ChallengeSubmission1, actual[0]);
            AssertEquals(ChallengeSubmission2, actual[1]);
            AssertEquals(ChallengeSubmission3, actual[2]);
        }

        [Test]
        public async Task Get_ReturnsChallengeSubmissionsByChallengeIdAndUserId()
        {
            using var dbContext = CreateDbContext();
            var repository = CreateRepository(dbContext);

            var actual = await repository.GetAsync(Guid1, Guid1);

            Assert.That(actual.Count, Is.EqualTo(2));
            AssertEquals(ChallengeSubmission1, actual[0]);
            AssertEquals(ChallengeSubmission2, actual[1]);
        }

        protected override DbContextChallengeSubmissionRepository CreateRepository(ApplicationDbContext dbContext) =>
            new DbContextChallengeSubmissionRepository(dbContext);

        protected override void AssertEquals(ChallengeSubmission expected, ChallengeSubmission actual)
        {
            Assert.That(actual.Id, Is.EqualTo(expected.Id));
            Assert.That(actual.ChallengeId, Is.EqualTo(expected.ChallengeId));
            Assert.That(actual.UserId, Is.EqualTo(expected.UserId));
            Assert.That(actual.Created, Is.EqualTo(expected.Created));
            Assert.That(actual.ProjectFile, Is.EqualTo(expected.ProjectFile));
            Assert.That(actual.EvaluationSuccessRate, Is.EqualTo(expected.EvaluationSuccessRate));
            Assert.That(actual.EvaluationMessage, Is.EqualTo(expected.EvaluationMessage));
        }

        protected override ChallengeSubmission CreateEntity() => new ChallengeSubmission(Guid2, Guid1, DateTime1, "submission project", 0, "");

        protected override void UpdateEntity(ChallengeSubmission entity) => entity.EvaluationMessage = "Some updated message";
        protected override IList<ChallengeSubmission> GetAllEntities() => new[] { ChallengeSubmission1, ChallengeSubmission2, ChallengeSubmission3, ChallengeSubmission4 };

        protected override Guid GetEntityId(ChallengeSubmission entity) => entity.Id;

        protected override Guid GetNotUsedEntityId() => NotUsedGuid;
    }
}
