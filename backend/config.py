import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "fake-news-detection-secret-key-2026")
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
    HEATMAP_FOLDER = os.path.join(UPLOAD_FOLDER, "heatmaps")
    FRAMES_FOLDER = os.path.join(UPLOAD_FOLDER, "frames")
    AUDIO_FOLDER = os.path.join(UPLOAD_FOLDER, "audio")
    DATABASE_PATH = os.path.join(BASE_DIR, "database.sqlite3")
    
    # Allowed Extensions
    ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "bmp"}
    ALLOWED_AUDIO_EXTENSIONS = {"wav", "mp3", "ogg", "m4a", "flac"}
    ALLOWED_VIDEO_EXTENSIONS = {"mp4", "avi", "mov", "mkv", "webm"}
    MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100 MB max upload
    
    # Blockchain Settings
    ETHEREUM_RPC_URL = os.environ.get("ETHEREUM_RPC_URL", "http://127.0.0.1:8545")
    SMART_CONTRACT_ADDRESS = os.environ.get("CONTRACT_ADDRESS", "0x71C8395B3045239a7b98dF291307b22Fce387062")
    SIMULATION_MODE = True  # Fallback to local cryptographic ledger if no live RPC node
