using ApplicationCore.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public DbSet<Challenge> Challenges { get; }
        public DbSet<ChallengeTestCase> ChallengeTestCases { get; }
        public DbSet<ChallengeSubmission> ChallengeSubmissions { get; }
        public DbSet<Project> Projects { get; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ChallengeSubmission>().OwnsOne(cs => cs.EvaluationResult);
        }
    }
}
