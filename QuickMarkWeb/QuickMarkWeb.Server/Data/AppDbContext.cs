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
            modelBuilder.Entity<Course>().HasKey(c => c.Code);
            modelBuilder.Entity<User>().HasKey(u => u.Username);

            modelBuilder.Entity<Questionnaire>()
                .HasOne(q => q.Course)
                .WithMany(c => c.Questionnaires)
                .HasForeignKey(q => q.CourseCode);

            modelBuilder.Entity<Exam>()
                .HasOne(e => e.Course)
                .WithMany(c => c.Exams)
                .HasForeignKey(e => e.CourseCode);

            modelBuilder.Entity<Exam>()
                .HasOne(e => e.User)
                .WithMany(u => u.Exams)
                .HasForeignKey(e => e.UserUsername);

            modelBuilder.Entity<Exam>()
                .HasOne(e => e.Questionnaire)
                .WithMany(q => q.Exams)
                .HasForeignKey(q => q.QuestionnaireId);

            modelBuilder.Entity<ExamResult>()
                .HasOne(er => er.Exam)
                .WithMany(e => e.ExamResults)
                .HasForeignKey(er => er.ExamId);

            modelBuilder.Entity<ExamResult>()
                .HasOne(er => er.User)
                .WithMany(u => u.ExamResults)
                .HasForeignKey(er => er.UserUsername);
        }
    }
}
