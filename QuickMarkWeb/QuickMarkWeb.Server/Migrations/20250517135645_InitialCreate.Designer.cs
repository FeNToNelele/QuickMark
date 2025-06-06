﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using QuickMarkWeb.Server.Data;

#nullable disable

namespace QuickMarkWeb.Server.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20250517135645_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("QuickMarkWeb.Server.Models.Course", b =>
                {
                    b.Property<string>("Code")
                        .HasColumnType("text")
                        .HasColumnName("code");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.HasKey("Code")
                        .HasName("p_k_course");

                    b.ToTable("course", (string)null);
                });

            modelBuilder.Entity("QuickMarkWeb.Server.Models.Exam", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("AppliedStudents")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("applied_students");

                    b.Property<string>("CorrectLimit")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("correct_limit");

                    b.Property<string>("CourseId")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("course_id");

                    b.Property<DateTime>("HeldAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("held_at");

                    b.Property<int>("QuestionAmount")
                        .HasColumnType("integer")
                        .HasColumnName("question_amount");

                    b.Property<int>("QuestionnaireId")
                        .HasColumnType("integer")
                        .HasColumnName("questionnaire_id");

                    b.Property<string>("UserUsername")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("user_username");

                    b.HasKey("Id")
                        .HasName("p_k_exam");

                    b.HasIndex("CourseId")
                        .HasDatabaseName("i_x_exam_course_id");

                    b.HasIndex("QuestionnaireId")
                        .HasDatabaseName("i_x_exam_questionnaire_id");

                    b.HasIndex("UserUsername")
                        .HasDatabaseName("i_x_exam_user_username");

                    b.ToTable("exam", (string)null);
                });

            modelBuilder.Entity("QuickMarkWeb.Server.Models.ExamResult", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("CorrectAnswers")
                        .HasColumnType("integer")
                        .HasColumnName("correct_answers");

                    b.Property<int>("ExamId")
                        .HasColumnType("integer")
                        .HasColumnName("exam_id");

                    b.Property<string>("ExamineeNeptunCode")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("examinee_neptun_code");

                    b.Property<string>("UserUsername")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("user_username");

                    b.HasKey("Id")
                        .HasName("p_k_exam_result");

                    b.HasIndex("ExamId")
                        .HasDatabaseName("i_x_exam_result_exam_id");

                    b.HasIndex("UserUsername")
                        .HasDatabaseName("i_x_exam_result_user_username");

                    b.ToTable("exam_result", (string)null);
                });

            modelBuilder.Entity("QuickMarkWeb.Server.Models.Questionnaire", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Answers")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("answers");

                    b.Property<string>("CourseCode")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("course_code");

                    b.Property<int>("ExamId")
                        .HasColumnType("integer")
                        .HasColumnName("exam_id");

                    b.Property<string>("GiftFile")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("gift_file");

                    b.HasKey("Id")
                        .HasName("p_k_questionnaire");

                    b.HasIndex("CourseCode")
                        .HasDatabaseName("i_x_questionnaire_course_code");

                    b.ToTable("questionnaire", (string)null);
                });

            modelBuilder.Entity("QuickMarkWeb.Server.Models.User", b =>
                {
                    b.Property<string>("Username")
                        .HasColumnType("text")
                        .HasColumnName("username");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("full_name");

                    b.Property<bool>("IsAdmin")
                        .HasColumnType("boolean")
                        .HasColumnName("is_admin");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("password");

                    b.Property<byte[]>("Salt")
                        .IsRequired()
                        .HasColumnType("bytea")
                        .HasColumnName("salt");

                    b.HasKey("Username")
                        .HasName("p_k_user");

                    b.ToTable("user", (string)null);
                });

            modelBuilder.Entity("QuickMarkWeb.Server.Models.Exam", b =>
                {
                    b.HasOne("QuickMarkWeb.Server.Models.Course", "Course")
                        .WithMany("Exams")
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_exam_course");

                    b.HasOne("QuickMarkWeb.Server.Models.Questionnaire", "Questionnaire")
                        .WithMany("Exams")
                        .HasForeignKey("QuestionnaireId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_exam_questionnaire");

                    b.HasOne("QuickMarkWeb.Server.Models.User", "User")
                        .WithMany("Exams")
                        .HasForeignKey("UserUsername")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_exam_user");

                    b.Navigation("Course");

                    b.Navigation("Questionnaire");

                    b.Navigation("User");
                });

            modelBuilder.Entity("QuickMarkWeb.Server.Models.ExamResult", b =>
                {
                    b.HasOne("QuickMarkWeb.Server.Models.Exam", "Exam")
                        .WithMany("ExamResults")
                        .HasForeignKey("ExamId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_exam_result_exam");

                    b.HasOne("QuickMarkWeb.Server.Models.User", "User")
                        .WithMany("ExamResults")
                        .HasForeignKey("UserUsername")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_exam_result_user");

                    b.Navigation("Exam");

                    b.Navigation("User");
                });

            modelBuilder.Entity("QuickMarkWeb.Server.Models.Questionnaire", b =>
                {
                    b.HasOne("QuickMarkWeb.Server.Models.Course", "Course")
                        .WithMany("Questionnaires")
                        .HasForeignKey("CourseCode")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_questionnaire_course");

                    b.Navigation("Course");
                });

            modelBuilder.Entity("QuickMarkWeb.Server.Models.Course", b =>
                {
                    b.Navigation("Exams");

                    b.Navigation("Questionnaires");
                });

            modelBuilder.Entity("QuickMarkWeb.Server.Models.Exam", b =>
                {
                    b.Navigation("ExamResults");
                });

            modelBuilder.Entity("QuickMarkWeb.Server.Models.Questionnaire", b =>
                {
                    b.Navigation("Exams");
                });

            modelBuilder.Entity("QuickMarkWeb.Server.Models.User", b =>
                {
                    b.Navigation("ExamResults");

                    b.Navigation("Exams");
                });
#pragma warning restore 612, 618
        }
    }
}
