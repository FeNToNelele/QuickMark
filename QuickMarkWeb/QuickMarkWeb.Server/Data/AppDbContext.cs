using Microsoft.EntityFrameworkCore;
using QuickMarkWeb.Server.Models;

namespace QuickMarkWeb.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Exam> Exams { get; set; }
        public DbSet<Questionnaire> Questionnaires { get; set; }
        public DbSet<ExamResult> ExamResults { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Exam>()
                .HasOne(e => e.Course)
                .WithMany()
                .HasForeignKey(e => e.CourseId);

            modelBuilder.Entity<Exam>()
                .HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserUsername);
        }
    }
}
