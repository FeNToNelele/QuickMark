from flask import Flask, request, Response, jsonify
from flask_cors import CORS
import timeit
import requests
from ExamGraderFromPic import ExamProcessor
from ExamPDFGenerator import ExamPDFGenerator


processor = ExamProcessor()
pdf_generator = ExamPDFGenerator()

app = Flask(__name__)
CORS(app)

@app.route('/examGrading', methods=['POST'])
def examGrading():
    content_type = request.headers.get('Content-Type', '')
    if content_type.startswith('image/'):
        # Read raw bytes
        data = request.get_data()

        if data is None:
            return jsonify({'Error': True, 'ErrorCode': 'Invalid image data'}), 400
        
    start = timeit.default_timer()
    try:
        # Process the exam img
        result = processor.process(data)

        exam = result.pop("exam")
        result.update({"correctAnswers":exam["CorrectDB"]})
        
        #save to server
        try:    #TODO: sendig json change to correct one
            savetoserver = requests.post("https://127.0.0.1:7045/api/SaveResults/save", json=result, headers={'Content-Type': 'application/json'}, timeout=5, verify=False)
            savetoserver.raise_for_status()
        except requests.RequestException as err:
            raise Exception(f"Save failed!, {str(err)}")
        
        #Extra for Debug and Mobile
        """result.update({"questionDb":exam["QuestionDB"]})
        stop = timeit.default_timer()
        result.update({'Time:': stop - start })"""

        return jsonify(result)
    except Exception as e:
        # Return any processing errors as JSON
        return jsonify({'Error': True, 'ErrorCode': str(e)}), 500       #DONE: Get GIFT from c# server with GET 127.0.0.1/api/Exam/exams/examID DONE #TODO: TEST
                                                                        #TODO: Send Grade back to App and to C# /api/SaveResults/save
    
    """# Start the Python app as a background process
    try:
        # Replace with your app's command (sanitized to prevent injection)
        cmd = "python3 /path/to/your_script.py"
        process = subprocess.Popen(
            shlex.split(cmd),
            stdout=open('/path/to/app.log', 'w'),
            stderr=subprocess.STDOUT
        )
        return jsonify({"status": "success", "pid": process.pid})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500"""
    
@app.route('/generate-pdf', methods=['POST'])
def generate_pdf_endpoint():
    try:
        data = request.get_json()
        pdf_bytes = pdf_generator.generate_exam_pdf_bytes(data)
        return Response(
            pdf_bytes,
            mimetype='application/pdf',
            headers={'Content-Disposition': 'attachment; filename=exam_sheets.pdf'}
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) #curl -v -X POST http://127.0.0.1:5000/examGrading -H "Accept: application/json"