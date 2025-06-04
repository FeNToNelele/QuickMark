# python-processor/Dockerfile

FROM python:3.12-bullseye AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
	libgl1 \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libgtk2.0-0 \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    gstreamer1.0-tools \
    gstreamer1.0-plugins-base \
    libavcodec-dev \
    libavformat-dev \
    libswscale-dev \
    && rm -rf /var/lib/apt/lists/*


COPY venv.txt .
RUN pip install --no-cache-dir -r venv.txt \
    && pip install torch torchvision torchaudio

COPY . .

FROM python:3.12-slim-bullseye AS runtime

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libgtk2.0-0 \
    gstreamer1.0-tools \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
	
    libjpeg62-turbo \
    libpng16-16 \
    libtiff5 \
    libavcodec58 \
    libavformat58 \
    libswscale5 \
	libzbar0\
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages

COPY . .

EXPOSE 8000

CMD ["python", "FlaskBackEndServer.py"]
