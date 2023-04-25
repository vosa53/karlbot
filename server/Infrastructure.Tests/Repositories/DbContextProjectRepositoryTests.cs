using ApplicationCore.Entities;
using Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Tests.Repositories
{
    public class DbContextProjectRepositoryTests : DbContextRepositoryTests<Project, Guid>
    {
        [Test]
        public async Task Get_ReturnsProjectsByAuthorId()
        {
            using var dbContext = CreateDbContext();
            var repository = CreateRepository(dbContext);

            var actual = await repository.GetAsync(Guid2);

            Assert.That(actual.Count, Is.EqualTo(1));
            AssertEquals(Project2, actual[0]);
        }

        protected override DbContextProjectRepository CreateRepository(ApplicationDbContext dbContext) => 
            new DbContextProjectRepository(dbContext);

        protected override void AssertEquals(Project expected, Project actual)
        {
            Assert.That(actual.Id, Is.EqualTo(expected.Id));
            Assert.That(actual.AuthorId, Is.EqualTo(expected.AuthorId));
            Assert.That(actual.IsPublic, Is.EqualTo(expected.IsPublic));
            Assert.That(actual.Created, Is.EqualTo(expected.Created));
            Assert.That(actual.Modified, Is.EqualTo(expected.Modified));
            Assert.That(actual.ProjectFile, Is.EqualTo(expected.ProjectFile));
        }

        protected override Project CreateEntity() => new Project(User1.Id, DateTime1, "project1");

        protected override void UpdateEntity(Project entity) => entity.ProjectFile = "Some updated project file";

        protected override IList<Project> GetAllEntities() => new[] { Project1, Project2 };

        protected override Guid GetEntityId(Project entity) => entity.Id;

        protected override Guid GetNotUsedEntityId() => NotUsedGuid;
    }
}
