using ApplicationCore.Entities;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Tests.Repositories
{
    public class DbContextUserRepositoryTests : DbContextRepositoryTests<User, Guid>
    {
        protected override DbContextRepository<User, Guid> CreateRepository(ApplicationDbContext dbContext) =>
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
            return new UserManager<User>(userStore, null, null, null, null, null, null, null, null);
        }
    }
}
