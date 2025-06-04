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
            modelBuilder.Entity<User>().ToTable("user");
            modelBuilder.Entity<Course>().ToTable("course");
            modelBuilder.Entity<Exam>().ToTable("exam");
            modelBuilder.Entity<Questionnaire>().ToTable("questionnaire");
            modelBuilder.Entity<ExamResult>().ToTable("exam_result");

            modelBuilder.Entity<Course>().HasKey(c => c.Code);
            modelBuilder.Entity<User>().HasKey(u => u.Username);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Username);
                entity.Property(u => u.Username)
                .HasColumnName("username")
                .HasColumnType("varchar(6)")
                .IsRequired();
                entity.Property(u => u.Password).HasColumnName("password");
                entity.Property(u => u.Salt).HasColumnName("salt");
                entity.Property(u => u.FullName)
                .HasColumnName("full_name")
                .IsRequired()
                .HasMaxLength(255);
                entity.Property(u => u.IsAdmin).HasColumnName("is_admin");
            });

            // Relationships
            modelBuilder.Entity<Questionnaire>()
                .HasOne(q => q.Course)
                .WithMany(c => c.Questionnaires)
                .HasForeignKey(q => q.CourseCode)
                .HasConstraintName("fk_questionnaire_course");

            modelBuilder.Entity<Exam>()
                .HasOne(e => e.Course)
                .WithMany(c => c.Exams)
                .HasForeignKey(e => e.CourseId)
                .HasConstraintName("fk_exam_course");

            modelBuilder.Entity<Exam>()
                .HasOne(e => e.User)
                .WithMany(u => u.Exams)
                .HasForeignKey(e => e.UserUsername)
                .HasConstraintName("fk_exam_user");

            modelBuilder.Entity<Exam>()
                .HasOne(e => e.Questionnaire)
                .WithMany()
                .HasForeignKey(e => e.QuestionnaireId)
                .HasConstraintName("fk_exam_questionnaire");

            modelBuilder.Entity<ExamResult>()
                .HasOne(er => er.Exam)
                .WithMany(e => e.ExamResults)
                .HasForeignKey(er => er.ExamId)
                .HasConstraintName("fk_exam_result_exam");

            modelBuilder.Entity<ExamResult>()
                .HasOne(er => er.User)
                .WithMany(u => u.ExamResults)
                .HasForeignKey(er => er.UserUsername)
                .HasConstraintName("fk_exam_result_user");

            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entity.GetProperties())
                {
                    property.SetColumnName(ConvertToSnakeCase(property.Name));
                }

                foreach (var key in entity.GetKeys())
                {
                    key.SetName(ConvertToSnakeCase(key.GetName()));
                }

                foreach (var fk in entity.GetForeignKeys())
                {
                    fk.SetConstraintName(ConvertToSnakeCase(fk.GetConstraintName()));
                }

                foreach (var index in entity.GetIndexes())
                {
                    index.SetDatabaseName(ConvertToSnakeCase(index.GetDatabaseName()));
                }
            }

        }

        private string ConvertToSnakeCase(string input)
        {
            return string.Concat(input.Select((c, i) =>
                i > 0 && char.IsUpper(c) ? "_" + c.ToString() : c.ToString()))
                .ToLower();
        }
    }
}