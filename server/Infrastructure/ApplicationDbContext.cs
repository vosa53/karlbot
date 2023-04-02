using ApplicationCore.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure
{
    /// <summary>
    /// Main application Entity Framework Core DbContext.
    /// </summary>
    public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        /// <summary>
        /// Challenges.
        /// </summary>
        public DbSet<Challenge> Challenges => Set<Challenge>();

        /// <summary>
        /// Test cases of challenges.
        /// </summary>
        public DbSet<ChallengeTestCase> ChallengeTestCases => Set<ChallengeTestCase>();

        /// <summary>
        /// Submissions of challenges.
        /// </summary>
        public DbSet<ChallengeSubmission> ChallengeSubmissions => Set<ChallengeSubmission>();

        /// <summary>
        /// Projects.
        /// </summary>
        public DbSet<Project> Projects => Set<Project>();

        /// <param name="options">Options.</param>
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        /// <inheritdoc/>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //modelBuilder.Entity<ChallengeSubmission>().OwnsOne(cs => cs.EvaluationResult);
            modelBuilder.Entity<Challenge>().Navigation(c => c.TestCases).AutoInclude();
        }

        /// <inheritdoc/>
        protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        {
            configurationBuilder
                .Properties<DateTime>()
                .HaveConversion<DateTimeValueConverter>();
        }

        /// <summary>
        /// DateTime converter specifying DateTimeKind.Utc for all DateTimes retrieved from the database.
        /// </summary>
        private class DateTimeValueConverter : ValueConverter<DateTime, DateTime>
        {
            public DateTimeValueConverter() : base(d => d, d => DateTime.SpecifyKind(d, DateTimeKind.Utc))
            {
            }
        }
    }
}
