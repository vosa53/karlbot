using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Tests.Repositories
{
    public abstract class DbContextRepositoryTests<TEntity, TKey> : DatabaseTest where TEntity : class
    {
        [Test]
        public async Task Get_ReturnsAllEntities()
        {
            using var dbContext = CreateDbContext();
            var repository = CreateRepository(dbContext);

            var actual = await repository.GetAsync();

            var expected = GetAllEntities();
            Assert.That(actual.Count, Is.EqualTo(expected.Count));
            for (var i = 0; i < expected.Count; i++)
                AssertEquals(expected[i], actual[i]);
        }

        [Test]
        public async Task GetById_ReturnsEntityByIdWhenExists()
        {
            using var dbContext = CreateDbContext();
            var repository = CreateRepository(dbContext);
            var expected = GetAllEntities().First();
            var expectedId = GetEntityId(expected);

            var actual = await repository.GetByIdAsync(expectedId);

            Assert.NotNull(actual);
            AssertEquals(expected, actual);
        }

        [Test]
        public async Task GetById_ReturnsNullWhenDoesNotExist()
        {
            using var dbContext = CreateDbContext();
            var repository = CreateRepository(dbContext);

            var project = await repository.GetByIdAsync(GetNotUsedEntityId());

            Assert.Null(project);
        }

        [Test]
        public async Task ExistsById_ReturnsTrueWhenExists()
        {
            using var dbContext = CreateDbContext();
            var repository = CreateRepository(dbContext);
            var expected = GetAllEntities().First();
            var expectedId = GetEntityId(expected);

            var exists = await repository.ExistsByIdAsync(expectedId);

            Assert.True(exists);
        }

        [Test]
        public async Task ExistsById_ReturnsFalseWhenDoesNotExist()
        {
            using var dbContext = CreateDbContext();
            var repository = CreateRepository(dbContext);

            var exists = await repository.ExistsByIdAsync(GetNotUsedEntityId());

            Assert.False(exists);
        }

        [Test]
        public async Task Add_AddsSingleEntity()
        {
            using var dbContext = CreateDbContext();
            dbContext.Database.BeginTransaction();
            var repository = CreateRepository(dbContext);
            var toAdd = CreateEntity();

            await repository.AddAsync(toAdd);
            dbContext.ChangeTracker.Clear();

            var added = await dbContext.Set<TEntity>().FindAsync(GetEntityId(toAdd));
            Assert.NotNull(added);
            AssertEquals(toAdd, added);
        }

        [Test]
        public async Task Update_UpdatesSingleEntity()
        {
            using var dbContext = CreateDbContext();
            dbContext.Database.BeginTransaction();
            var repository = CreateRepository(dbContext);
            var toUpdate = await dbContext.Set<TEntity>().FirstAsync();
            UpdateEntity(toUpdate);

            await repository.UpdateAsync(toUpdate);
            dbContext.ChangeTracker.Clear();

            var updatedProject = await dbContext.Set<TEntity>().FindAsync(GetEntityId(toUpdate));
            Assert.NotNull(updatedProject);
            AssertEquals(toUpdate, updatedProject);
        }

        [Test]
        public async Task Remove_RemovesSingleEntity()
        {
            using var dbContext = CreateDbContext();
            dbContext.Database.BeginTransaction();
            var repository = CreateRepository(dbContext);
            var toRemove = await dbContext.Set<TEntity>().FirstAsync();

            await repository.RemoveAsync(toRemove);
            dbContext.ChangeTracker.Clear();

            var removed = await dbContext.Set<TEntity>().FindAsync(GetEntityId(toRemove));
            Assert.Null(removed);
        }

        protected abstract DbContextRepository<TEntity, TKey> CreateRepository(ApplicationDbContext dbContext);
        protected abstract void AssertEquals(TEntity expected, TEntity actual);
        protected abstract TEntity CreateEntity();
        protected abstract void UpdateEntity(TEntity entity);
        protected abstract IList<TEntity> GetAllEntities();
        protected abstract TKey GetEntityId(TEntity entity);
        protected abstract TKey GetNotUsedEntityId();
    }
}
