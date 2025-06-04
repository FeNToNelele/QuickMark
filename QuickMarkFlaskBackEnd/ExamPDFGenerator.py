import re
import qrcode
import cv2
from cv2 import aruco
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
from reportlab.lib.utils import ImageReader

class ExamPDFGenerator:
    def __init__(self):
        # Pre-generate ArUco markers into memory
        self.aruco_markers = self.generate_aruco_markers()

    # --- GIFT kérdések feldolgozása ---    
    def parse_gift_answer_counts(self, content):
        pattern = re.compile(r"::.*?::(.*?)\{(.*?)\}", re.DOTALL)
        matches = pattern.findall(content)
        answer_counts = []
        for _, answers_block in matches:
            lines = [line.strip() for line in re.split(r'\r?\n', answers_block.strip())]
            options = [line for line in lines if line.startswith(('=', '~'))]
            answer_counts.append(len(options))
        return answer_counts

    # --- QR kód generálása in-memory ---
    def create_qr_image(self, data_dict):
        payload = f"{data_dict['examinorId']};{data_dict['examId']};{data_dict['neptunCode']}"
        qr = qrcode.QRCode(version=2, error_correction=qrcode.constants.ERROR_CORRECT_Q)
        qr.add_data(payload)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        # convert PIL Image to ReportLab ImageReader
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        return ImageReader(buffer)

    # --- ArUco markerek generálása in-memory ---
    def generate_aruco_markers(self):
        dictionary = aruco.getPredefinedDictionary(aruco.DICT_4X4_50)
        markers = {}
        for marker_id in range(4):
            marker_img = aruco.generateImageMarker(dictionary, marker_id, 200)
            # encode to PNG bytes
            success, png = cv2.imencode('.png', marker_img)
            buffer = BytesIO(png.tobytes())
            markers[marker_id] = ImageReader(buffer)
        return markers

    # --- Sarokjelölők ---
    def draw_corner_markers(self, c, width, height):
        marker_size = 1.5 * cm
        # choose ImageReader objects
        c.drawImage(self.aruco_markers[0], 0.5 * cm, height - 2 * cm, width=marker_size, height=marker_size)
        c.drawImage(self.aruco_markers[3], width - 2 * cm, height - 2 * cm, width=marker_size, height=marker_size)
        c.drawImage(self.aruco_markers[1], 0.5 * cm, 0.5 * cm, width=marker_size, height=marker_size)
        c.drawImage(self.aruco_markers[2], width - 2 * cm, 0.5 * cm, width=marker_size, height=marker_size)

    # --- Opció betűjelek kiírása az oszlop tetejére ---
    def draw_option_headers(self, c, x_start, max_options, col_spacing, height, top_margin):
        for i in range(max_options):
            label = chr(65 + i)
            x = x_start + (i * col_spacing)
            c.drawString(x + 0.1 * cm, height - top_margin + 0.5 * cm, label)

    # --- Egy oldal generálása ---
    def generate_exam_page(self, c, answer_counts, qr_data, width, height):
        from reportlab.lib.colors import black

        # get in-memory QR image
        qr_image = self.create_qr_image(qr_data)
        self.draw_corner_markers(c, width, height)

        qr_size = 2.5 * cm
        qr_x = width - 2 * cm - qr_size - 0.5 * cm
        qr_y = height - 3 * cm
        c.drawImage(qr_image, qr_x, qr_y, width=qr_size, height=qr_size)

        top_margin = 4 * cm
        bottom_margin = 2 * cm
        box_size = 0.4 * cm
        row_height = 0.65 * cm
        col_spacing = 1.6 * cm

        c.setFont("Helvetica", 12)

        if len(answer_counts) > 30:
            half = len(answer_counts) // 2 + (len(answer_counts) % 2)
            left_questions = answer_counts[:half]
            right_questions = answer_counts[half:]

            center_x = width / 2
            left_margin_left = center_x - (col_spacing * 4) - 0.5 * cm
            left_margin_right = center_x + 1.0 * cm

            max_left_options = max(left_questions)
            max_right_options = max(right_questions)

            c.setStrokeColor(black)
            c.setLineWidth(0.5)
            c.line(center_x, height - top_margin, center_x, bottom_margin)

            self.draw_option_headers(c, left_margin_left, max_left_options, col_spacing, height, top_margin)
            self.draw_option_headers(c, left_margin_right, max_right_options, col_spacing, height, top_margin)

            def draw_column_questions(questions, x_start, y_start, start_idx):
                y = y_start
                for local_idx, num_options in enumerate(questions):
                    global_idx = start_idx + local_idx
                    if y < bottom_margin + row_height:
                        c.showPage()
                        self.draw_corner_markers(c, width, height)
                        y = height - top_margin
                        self.draw_option_headers(c, x_start, num_options, col_spacing, height, top_margin)

                    c.drawRightString(x_start - 0.4 * cm, y - 0.35 * cm, f"{global_idx}.")
                    for i in range(num_options):
                        x = x_start + (i * col_spacing)
                        c.rect(x, y - 0.5 * cm, box_size, box_size)
                    y -= row_height

            draw_column_questions(left_questions, left_margin_left, height - top_margin, 1)
            draw_column_questions(right_questions, left_margin_right, height - top_margin, len(left_questions) + 1)

        else:
            left_margin = 4.5 * cm
            y = height - top_margin
            col_spacing = 3.0 * cm
            max_options = max(answer_counts)

            self.draw_option_headers(c, left_margin, max_options, col_spacing, height, top_margin)

            for idx, num_options in enumerate(answer_counts, 1):
                if y < bottom_margin + row_height:
                    c.showPage()
                    self.draw_corner_markers(c, width, height)
                    y = height - top_margin
                    self.draw_option_headers(c, left_margin, num_options, col_spacing, height, top_margin)

                c.drawRightString(left_margin - 1.2 * cm, y - 0.35 * cm, f"{idx}.")
                for i in range(num_options):
                    x = left_margin + (i * col_spacing)
                    c.rect(x, y - 0.5 * cm, box_size, box_size)
                y -= row_height

    # --- PDF memóriába generálása ---
    def generate_exam_pdf_bytes(self, data):
        gift_text = data["questionnaire"]["giftFile"]
        answer_counts = self.parse_gift_answer_counts(gift_text)

        exam_id = data["id"]
        examiner_id = data["user"]["username"]
        neptun_codes = [code.strip() for code in data["appliedStudents"].split(";") if code.strip()]

        buffer = BytesIO()
        c = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4

        for neptun in neptun_codes:
            qr_payload = {
                "examId": exam_id,
                "examinorId": examiner_id,
                "neptunCode": neptun
            }
            self.generate_exam_page(c, answer_counts, qr_payload, width, height)
            c.showPage()

        c.save()
        buffer.seek(0)
        return buffer.getvalue()
