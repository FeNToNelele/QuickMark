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
        public static User ToUserModel(this UserDTO userDTO)
        {
            return new User
            {
                Username = userDTO.Username,
                FullName = userDTO.FullName,
                Password = userDTO.Password,
                Salt = userDTO.Salt,
                IsAdmin = userDTO.IsAdmin
            };
        }

        public static Course ToCourseModel(this CourseDTO courseDTO)
        {
            return new Course
            {
                Code = courseDTO.Code,
                Name = courseDTO.Name,
                Questionnaires = new List<Questionnaire>(),
                Exams = new List<Exam>()
            };
        }

        public static Questionnaire ToQuestionnaireModel(this QuestionnaireDTO questionnaireDTO)
        {
            return new Questionnaire
            {
                Id = questionnaireDTO.Id,
                GiftFile = questionnaireDTO.GiftFile,
                Answers = questionnaireDTO.Answers,
                CourseCode = questionnaireDTO.CourseCode,
                Exams = new List<Exam>()
            };
        }

        public static Exam ToExamModel(this ExamDTO examDTO)
        {
            return new Exam
            {
                Id = examDTO.Id,
                CourseCode = examDTO.CourseCode,
                UserUsername = examDTO.UserUsername,
                HeldAt = examDTO.HeldAt,
                QuestionnaireId = examDTO.QuestionnaireId,
                QuestionAmount = examDTO.QuestionAmount,
                CorrectLimit = examDTO.CorrectLimit,
                AppliedStudents = examDTO.AppliedStudents,
                ExamResults = new List<ExamResult>()
            };
        }

        public static ExamResult ToExamResultModel(this ExamResultDTO examResultDTO)
        {
            return new ExamResult
            {
                Id = examResultDTO.Id,
                ExamId = examResultDTO.ExamId,
                ExamineeNeptunCode = examResultDTO.ExamineeNeptunCode,
                UserUsername = examResultDTO.UserUsername,
                CorrectAnswers = examResultDTO.CorrectAnswers
            };
        }

        public static ExamDTO ToExamDTO(this Exam exam)
        {
            return new ExamDTO
            {
                Id = exam.Id,
                CourseCode = exam.CourseCode,
                UserUsername = exam.UserUsername,
                HeldAt = exam.HeldAt,
                QuestionnaireId = exam.QuestionnaireId,
                QuestionAmount = exam.QuestionAmount,
                CorrectLimit = exam.CorrectLimit,
                AppliedStudents = exam.AppliedStudents
            };
        }
        public static QuestionnaireDTO ToQuestionnaireDTO(this Questionnaire questionnaire)
        {
            return new QuestionnaireDTO
            {
                Id = questionnaire.Id,
                GiftFile = questionnaire.GiftFile,
                Answers = questionnaire.Answers,
                CourseCode = questionnaire.CourseCode
            };
        }
    }
}