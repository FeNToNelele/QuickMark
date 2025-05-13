using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Exam
{
    public class NewExamRequest
    {
        public string CourseCode { get; set; }
        public string UserUsername { get; set; }
        public DateTime HeldAt { get; set; }
        public int QuestionnaireId { get; set; }
        public int QuestionAmount { get; set; }
        public string CorrectLimit { get; set; } //if regular exam, multiple limits separated by comma
        public string AppliedStudents { get; set; }
    }
}
