import os
import math
import struct
import wave
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
HEATMAP_DIR = os.path.join(UPLOADS_DIR, "heatmaps")
AUDIO_DIR = os.path.join(UPLOADS_DIR, "audio")
VIDEOS_DIR = os.path.join(UPLOADS_DIR, "videos")

for d in [UPLOADS_DIR, HEATMAP_DIR, AUDIO_DIR, VIDEOS_DIR]:
    os.makedirs(d, exist_ok=True)

# 1. Generate Sample Authentic Image (Clean gradient, uniform noise)
img_real_path = os.path.join(UPLOADS_DIR, "sample_real_mars.jpg")
img_real = Image.new("RGB", (640, 360), color=(180, 85, 45))
draw_real = ImageDraw.Draw(img_real)
draw_real.rectangle([20, 20, 620, 340], outline=(220, 120, 70), width=4)
draw_real.text((40, 50), "NASA / JPL-Caltech Mars Exploration Rover", fill=(255, 255, 255))
draw_real.text((40, 90), "Spectrometric Hydrated Silica Geological Analysis", fill=(240, 240, 240))
draw_real.text((40, 130), "Location: Jezero Crater Rim | Telemetry Verified", fill=(210, 210, 210))
img_real.save(img_real_path, "JPEG", quality=95)

# 2. Generate Sample Manipulated Image (with high-compression spliced anomaly block)
img_fake_path = os.path.join(UPLOADS_DIR, "sample_fake_explosion.jpg")
img_fake = Image.new("RGB", (640, 360), color=(25, 30, 45))
draw_fake = ImageDraw.Draw(img_fake)
draw_fake.text((40, 40), "BREAKING VIRAL IMAGE: Downtown Event Allegation", fill=(255, 200, 50))
# Create spliced anomaly with high-frequency noise difference
spliced_box = np.random.randint(200, 255, (120, 180, 3), dtype=np.uint8)
img_fake_np = np.array(img_fake)
img_fake_np[160:280, 230:410] = spliced_box
cv2.putText(img_fake_np, "SPLICED HOTSPOT", (240, 220), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 2)
cv2.imwrite(img_fake_path, cv2.cvtColor(img_fake_np, cv2.COLOR_RGB2BGR))

# 3. Generate Sample WAV Audio (16-bit PCM, 44100Hz, 3 seconds)
audio_path = os.path.join(AUDIO_DIR, "sample_audio_announcement.wav")
rate = 44100
duration = 3.0
num_samples = int(rate * duration)
with wave.open(audio_path, 'wb') as wf:
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(rate)
    frames = bytearray()
    for i in range(num_samples):
        # Sine wave with human vocal fundamental frequency ~220Hz + modulation
        t = float(i) / rate
        val = int(12000.0 * math.sin(2.0 * math.pi * 220.0 * t) * (0.8 + 0.2 * math.sin(2.0 * math.pi * 4.0 * t)))
        frames.extend(struct.pack('<h', val))
    wf.writeframes(frames)

# 4. Generate Sample MP4 Video (5 seconds, 25fps)
video_path = os.path.join(VIDEOS_DIR, "sample_video_clip.mp4")
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(video_path, fourcc, 25.0, (640, 360))
for frame_idx in range(75):
    f = np.zeros((360, 640, 3), dtype=np.uint8)
    f[:] = (15, 20, 35) # Dark cyber bg
    cv2.putText(f, "VERITASCHAIN VIDEO FORENSIC SAMPLE", (40, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 220, 255), 2)
    cv2.putText(f, f"TIMESTAMP: 00:0{frame_idx // 25}.{frame_idx % 25:02d}s", (40, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 2)
    cv2.putText(f, f"FRAME INDEX: #{frame_idx + 1:03d} / 075", (40, 160), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (100, 255, 100), 2)
    cv2.circle(f, (320 + int(100 * math.sin(frame_idx * 0.1)), 250), 30, (0, 165, 255), -1)
    out.write(f)
out.release()

print("All sample multimedia assets created successfully:")
print(" -", img_real_path)
print(" -", img_fake_path)
print(" -", audio_path)
print(" -", video_path)
