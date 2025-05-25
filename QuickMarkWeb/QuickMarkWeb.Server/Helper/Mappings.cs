using Npgsql.EntityFrameworkCore.PostgreSQL.Query.ExpressionTranslators.Internal;
using QuickMarkWeb.Server.Models;
using Shared.Course;
using Shared.Exam;
using Shared.ExamResult;
using Shared.Questionnaire;
using Shared.User;

namespace QuickMarkWeb.Server.Helper
{
    public static class Mappings
    {
        public static User ToUserModel(this NewUserRequest userRequest)
        {
            return new User
            {
                Username = userRequest.Username,
                FullName = userRequest.FullName,
                Password = userRequest.Password,
                Salt = userRequest.Salt,
                IsAdmin = userRequest.IsAdmin
            };
        }

        public static UserDTO ToUserDTO(this User user)
        {
            return new UserDTO
            {
                Username = user.Username,
                FullName = user.FullName,
                Password = user.Password,
                Salt = user.Salt,
                IsAdmin = user.IsAdmin
            };
        }

        public static UserInfoDTO ToUserInfoDTO(this User user)
        {
            return new UserInfoDTO
            {
                Username = user.Username,
                FullName = user.FullName,
                IsAdmin = user.IsAdmin
            };
        }

        public static Course ToCourseModel(this NewCourseRequest courseRequest)
        {
            return new Course
            {
                Code = courseRequest.Code,
                Name = courseRequest.Name,
                Questionnaires = new List<Questionnaire>(),
                Exams = new List<Exam>()
            };
        }

        public static CourseDTO ToCourseDTO(this Course course)
        {
            return new CourseDTO
            {
                Code = course.Code,
                Name = course.Name
            };
        }

        /*public static Questionnaire ToQuestionnaireModel(this NewQuestionnaireRequest questionnaireRequest)
        {
            return new Questionnaire
            {
                GiftFile = questionnaireRequest.GiftFile,
                CourseCode = questionnaireRequest.CourseCode
            };
        }*/

        public static QuestionnaireDTO ToQuestionnaireDTO(this Questionnaire questionnaire)
        {
            return new QuestionnaireDTO
            {
                Id = questionnaire.Id,
                GiftFile = questionnaire.GiftFile,
                CourseCode = questionnaire.CourseCode
            };
        }

        public static Exam ToExamModel(this NewExamRequest examRequest)
        {
            return new Exam
            {
                CourseId = examRequest.CourseCode,       
                UserUsername = examRequest.UserUsername,
                HeldAt = examRequest.HeldAt,
                QuestionnaireId = examRequest.QuestionnaireId,
                QuestionAmount = examRequest.QuestionAmount,
                CorrectLimit = examRequest.CorrectLimit,
                AppliedStudents = examRequest.AppliedStudents,
                ExamResults = new List<ExamResult>()
            };
        }

        public static ExamDTO ToExamDTO(this Exam exam)
        {
            return new ExamDTO
            {
                Id = exam.Id,
                CourseCode = exam.CourseId,
                UserUsername = exam.UserUsername,
                HeldAt = exam.HeldAt,
                QuestionnaireId = exam.QuestionnaireId,
                QuestionAmount = exam.QuestionAmount,
                CorrectLimit = exam.CorrectLimit,
                AppliedStudents = exam.AppliedStudents,
                Course = exam.Course?.ToCourseDTO(),
                User = exam.User?.ToUserInfoDTO(),
                Questionnaire = exam.Questionnaire?.ToQuestionnaireDTO()
            };
        }

        public static ExamResult ToExamResultModel(this NewExamResultRequest examResultRequest)
        {
            return new ExamResult
            {
                ExamId = examResultRequest.ExamId,
                ExamineeNeptunCode = examResultRequest.ExamineeNeptunCode,
                UserUsername = examResultRequest.UserUsername,
                CorrectAnswers = examResultRequest.CorrectAnswers
            };
        }

        public static ExamResultDTO ToExamResultDTO(this ExamResult examResult)
        {
            return new ExamResultDTO
            {
                Id = examResult.Id,
                ExamId = examResult.ExamId,
                ExamineeNeptunCode = examResult.ExamineeNeptunCode,
                UserUsername = examResult.UserUsername,
                CorrectAnswers = examResult.CorrectAnswers,
                Exam = examResult.Exam.ToExamDTO(),
                User = examResult.User.ToUserDTO()
            };
        }
    }
}