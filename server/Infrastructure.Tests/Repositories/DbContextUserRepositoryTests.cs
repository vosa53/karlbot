using ApplicationCore.Entities;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Infrastructure.Tests.Repositories
{
    public class DbContextUserRepositoryTests : DbContextRepositoryTests<User, Guid>
    {
        [Test]
        public async Task GetRoles_ReturnsRolesWhenUserExists()
        {
            using var dbContext = CreateDbContext();
            var repository = CreateRepository(dbContext);

            var actual = await repository.GetRolesAsync(User2.Id);

            CollectionAssert.AreEquivalent(new[] { "Role2", "Role3" }, actual);
        }

        [Test]
        public async Task GetRoles_ReturnsNullWhenUserDoesNotExist()
        {
            using var dbContext = CreateDbContext();
            var repository = CreateRepository(dbContext);

            var actual = await repository.GetRolesAsync(NotUsedGuid);

            Assert.Null(actual);
        }

        protected override DbContextUserRepository CreateRepository(ApplicationDbContext dbContext) =>
            new DbContextUserRepository(dbContext, CreateUserManager(dbContext));

        protected override void AssertEquals(User expected, User actual)
        {
            Assert.That(actual.Id, Is.EqualTo(expected.Id));
            Assert.That(actual.UserName, Is.EqualTo(expected.UserName));
            Assert.That(actual.Email, Is.EqualTo(expected.Email));
        }

        protected override User CreateEntity() => new User("some@email.com");

        protected override void UpdateEntity(User entity) => entity.Email = "some.updated@email.com";
        protected override IList<User> GetAllEntities() => new[] { User1, User2 };

        protected override Guid GetEntityId(User entity) => entity.Id;

        protected override Guid GetNotUsedEntityId() => NotUsedGuid;

        protected UserManager<User> CreateUserManager(ApplicationDbContext dbContext)
        {
            var userStore = new UserStore<User, IdentityRole<Guid>, ApplicationDbContext, Guid>(dbContext);
            return new UserManager<User>(userStore, null!, null!, null!, null!, null!, null!, null!, null!);
        }
    }
}
