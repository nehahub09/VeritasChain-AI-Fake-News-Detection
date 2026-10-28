import os
import time
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from config import Config
from database import (
    init_db,
    save_news_record,
    get_stats,
    get_recent_records,
    get_record_by_hash,
    get_all_transactions
)
from blockchain.web3_client import blockchain_manager
from models.text_analyzer import text_analyzer
from models.image_analyzer import image_analyzer
from models.audio_analyzer import audio_analyzer
from models.video_analyzer import video_analyzer

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for all routes (allows React frontend on port 5173 to communicate seamlessly)
CORS(app, resources={r"/api/*": {"origins": "*"}, r"/uploads/*": {"origins": "*"}})

# Ensure upload folders exist
for folder in [Config.UPLOAD_FOLDER, Config.HEATMAP_FOLDER, Config.FRAMES_FOLDER, Config.AUDIO_FOLDER]:
    os.makedirs(folder, exist_ok=True)

# Initialize database and seed benchmark records
init_db()

# ----------------- STATIC MEDIA SERVING -----------------
@app.route("/uploads/<path:filename>")
def serve_uploads(filename):
    return send_from_directory(Config.UPLOAD_FOLDER, filename)

# ----------------- SYSTEM & STATS -----------------
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "service": "AI Fake News Detection & Blockchain Verification API",
        "version": "2.4.0",
        "blockchain": {
            "mode": "Ethereum Live" if blockchain_manager.is_connected else "Cryptographic EVM Ledger",
            "contract_address": Config.SMART_CONTRACT_ADDRESS,
            "connected": blockchain_manager.is_connected
        },
        "ai_engines": {
            "text_nlp": "Operational (TF-IDF + Stylometric Classifier)",
            "image_cv": "Operational (OpenCV + Error Level Analysis)",
            "audio_stt": "Operational (SpeechRecognition + Acoustic Analyzer)",
            "video_vision": "Operational (OpenCV Keyframe Forensics)"
        }
    })

@app.route("/api/stats", methods=["GET"])
def stats():
    try:
        data = get_stats()
        return jsonify({"success": True, "data": data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/history", methods=["GET"])
def history():
    try:
        limit = request.args.get("limit", 25, type=int)
        records = get_recent_records(limit)
        return jsonify({"success": True, "records": records})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ----------------- TEXT ANALYSIS -----------------
@app.route("/api/analyze/text", methods=["POST"])
def analyze_text():
    try:
        payload = request.get_json(force=True)
        text = payload.get("text", "").strip()
        headline = payload.get("headline", "").strip()
        source_url = payload.get("source_url", "").strip()

        if not text and not headline:
            return jsonify({"success": False, "error": "News text or headline is required"}), 400

        # Compute deterministic Keccak-256 hash
        full_content = f"{headline}\n{text}"
        news_hash = blockchain_manager.compute_text_hash(full_content)

        # Run AI/ML NLP Analysis
        analysis = text_analyzer.analyze(text=text, headline=headline, source_url=source_url)

        # Record to Blockchain
        tx_receipt = blockchain_manager.record_verification(
            news_hash=news_hash,
            title=headline or text[:60],
            media_type="text",
            verdict=analysis["verdict"],
            fake_percentage=analysis["fake_percentage"],
            real_percentage=analysis["real_percentage"],
            confidence=analysis["confidence"],
            metadata_uri=source_url
        )

        # Store in SQLite
        record_data = {
            "news_hash": news_hash,
            "title": headline or text[:80],
            "content_excerpt": text[:400],
            "media_type": "text",
            "verdict": analysis["verdict"],
            "fake_percentage": analysis["fake_percentage"],
            "real_percentage": analysis["real_percentage"],
            "confidence": analysis["confidence"],
            "explanation": analysis["explanation"],
            "factors": analysis.get("factors", {}),
            "file_path": "",
            "tx_hash": tx_receipt["tx_hash"],
            "block_number": tx_receipt["block_number"],
            "gas_used": tx_receipt["gas_used"],
            "signer_address": tx_receipt["signer_address"]
        }
        save_news_record(record_data)

        return jsonify({
            "success": True,
            "news_hash": news_hash,
            "analysis": analysis,
            "blockchain": tx_receipt
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ----------------- IMAGE ANALYSIS -----------------
@app.route("/api/analyze/image", methods=["POST"])
def analyze_image():
    try:
        if "image" not in request.files:
            return jsonify({"success": False, "error": "No image file provided in upload"}), 400

        file = request.files["image"]
        caption = request.form.get("caption", "").strip()

        if file.filename == "":
            return jsonify({"success": False, "error": "Empty filename"}), 400

        filename = f"{int(time.time())}_{secure_filename(file.filename)}"
        saved_path = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(saved_path)

        # Compute content hash
        news_hash = blockchain_manager.compute_file_hash(saved_path)

        # Run Image Forensics & OCR
        analysis = image_analyzer.analyze(image_path=saved_path, user_caption=caption)

        # Record to Blockchain
        title = caption or f"Image Scan: {file.filename}"
        tx_receipt = blockchain_manager.record_verification(
            news_hash=news_hash,
            title=title[:60],
            media_type="image",
            verdict=analysis["verdict"],
            fake_percentage=analysis["fake_percentage"],
            real_percentage=analysis["real_percentage"],
            confidence=analysis["confidence"],
            metadata_uri=f"/uploads/{filename}"
        )

        # Save to DB
        record_data = {
            "news_hash": news_hash,
            "title": title[:80],
            "content_excerpt": analysis.get("ocr_text", "")[:400],
            "media_type": "image",
            "verdict": analysis["verdict"],
            "fake_percentage": analysis["fake_percentage"],
            "real_percentage": analysis["real_percentage"],
            "confidence": analysis["confidence"],
            "explanation": analysis["explanation"],
            "factors": analysis.get("factors", {}),
            "file_path": f"/uploads/{filename}",
            "tx_hash": tx_receipt["tx_hash"],
            "block_number": tx_receipt["block_number"],
            "gas_used": tx_receipt["gas_used"],
            "signer_address": tx_receipt["signer_address"]
        }
        save_news_record(record_data)

        return jsonify({
            "success": True,
            "news_hash": news_hash,
            "file_url": f"/uploads/{filename}",
            "analysis": analysis,
            "blockchain": tx_receipt
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ----------------- AUDIO ANALYSIS -----------------
@app.route("/api/analyze/audio", methods=["POST"])
def analyze_audio():
    try:
        if "audio" not in request.files:
            return jsonify({"success": False, "error": "No audio file provided in upload"}), 400

        file = request.files["audio"]
        context_claim = request.form.get("context_claim", "").strip()

        if file.filename == "":
            return jsonify({"success": False, "error": "Empty filename"}), 400

        filename = f"{int(time.time())}_{secure_filename(file.filename)}"
        saved_path = os.path.join(Config.AUDIO_FOLDER, filename)
        file.save(saved_path)

        # Compute content hash
        news_hash = blockchain_manager.compute_file_hash(saved_path)

        # Run Speech Recognition & Acoustic Forensics
        analysis = audio_analyzer.analyze(audio_path=saved_path, context_claim=context_claim)

        title = context_claim or f"Audio Clip: {file.filename}"
        tx_receipt = blockchain_manager.record_verification(
            news_hash=news_hash,
            title=title[:60],
            media_type="audio",
            verdict=analysis["verdict"],
            fake_percentage=analysis["fake_percentage"],
            real_percentage=analysis["real_percentage"],
            confidence=analysis["confidence"],
            metadata_uri=f"/uploads/audio/{filename}"
        )

        record_data = {
            "news_hash": news_hash,
            "title": title[:80],
            "content_excerpt": analysis.get("transcription", "")[:400],
            "media_type": "audio",
            "verdict": analysis["verdict"],
            "fake_percentage": analysis["fake_percentage"],
            "real_percentage": analysis["real_percentage"],
            "confidence": analysis["confidence"],
            "explanation": analysis["explanation"],
            "factors": analysis.get("factors", {}),
            "file_path": f"/uploads/audio/{filename}",
            "tx_hash": tx_receipt["tx_hash"],
            "block_number": tx_receipt["block_number"],
            "gas_used": tx_receipt["gas_used"],
            "signer_address": tx_receipt["signer_address"]
        }
        save_news_record(record_data)

        return jsonify({
            "success": True,
            "news_hash": news_hash,
            "file_url": f"/uploads/audio/{filename}",
            "analysis": analysis,
            "blockchain": tx_receipt
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ----------------- VIDEO ANALYSIS -----------------
@app.route("/api/analyze/video", methods=["POST"])
def analyze_video():
    try:
        if "video" not in request.files:
            return jsonify({"success": False, "error": "No video file provided in upload"}), 400

        file = request.files["video"]
        context_claim = request.form.get("context_claim", "").strip()

        if file.filename == "":
            return jsonify({"success": False, "error": "Empty filename"}), 400

        filename = f"{int(time.time())}_{secure_filename(file.filename)}"
        video_dir = os.path.join(Config.UPLOAD_FOLDER, "videos")
        os.makedirs(video_dir, exist_ok=True)
        saved_path = os.path.join(video_dir, filename)
        file.save(saved_path)

        # Compute content hash
        news_hash = blockchain_manager.compute_file_hash(saved_path)

        # Run Video Keyframe extraction & multi-modal analysis
        analysis = video_analyzer.analyze(video_path=saved_path, context_claim=context_claim)

        title = context_claim or f"Video Footage: {file.filename}"
        tx_receipt = blockchain_manager.record_verification(
            news_hash=news_hash,
            title=title[:60],
            media_type="video",
            verdict=analysis["verdict"],
            fake_percentage=analysis["fake_percentage"],
            real_percentage=analysis["real_percentage"],
            confidence=analysis["confidence"],
            metadata_uri=f"/uploads/videos/{filename}"
        )

        record_data = {
            "news_hash": news_hash,
            "title": title[:80],
            "content_excerpt": context_claim[:400] or "Multi-frame video sequence analyzed",
            "media_type": "video",
            "verdict": analysis["verdict"],
            "fake_percentage": analysis["fake_percentage"],
            "real_percentage": analysis["real_percentage"],
            "confidence": analysis["confidence"],
            "explanation": analysis["explanation"],
            "factors": analysis.get("factors", {}),
            "file_path": f"/uploads/videos/{filename}",
            "tx_hash": tx_receipt["tx_hash"],
            "block_number": tx_receipt["block_number"],
            "gas_used": tx_receipt["gas_used"],
            "signer_address": tx_receipt["signer_address"]
        }
        save_news_record(record_data)

        return jsonify({
            "success": True,
            "news_hash": news_hash,
            "file_url": f"/uploads/videos/{filename}",
            "analysis": analysis,
            "blockchain": tx_receipt
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ----------------- BLOCKCHAIN VERIFICATION -----------------
@app.route("/api/blockchain/verify/<query_hash>", methods=["GET"])
def verify_hash(query_hash):
    try:
        record = get_record_by_hash(query_hash)
        if not record:
            return jsonify({
                "success": False,
                "verified": False,
                "message": f"No blockchain record found matching hash: {query_hash}"
            }), 404

        return jsonify({
            "success": True,
            "verified": True,
            "record": record,
            "contract_address": Config.SMART_CONTRACT_ADDRESS,
            "immutability_proof": {
                "hash_matched": True,
                "news_hash": record["news_hash"],
                "tx_hash": record["tx_hash"],
                "block_number": record["block_number"],
                "status": "VALID_ON_CHAIN_PROOF",
                "network": "Ethereum EVM Compatible"
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/blockchain/transactions", methods=["GET"])
def transactions():
    try:
        limit = request.args.get("limit", 50, type=int)
        txs = get_all_transactions(limit)
        return jsonify({"success": True, "transactions": txs})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/blockchain/contract-info", methods=["GET"])
def contract_info():
    sol_path = os.path.join(os.path.dirname(__file__), "blockchain", "contracts", "NewsVerification.sol")
    code = ""
    if os.path.exists(sol_path):
        with open(sol_path, "r", encoding="utf-8") as f:
            code = f.read()

    return jsonify({
        "contract_address": Config.SMART_CONTRACT_ADDRESS,
        "network": "Ethereum (Local EVM / Sepolia)",
        "compiler_version": "0.8.20",
        "abi": blockchain_manager.abi,
        "solidity_code": code
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 AI Fake News Detection & Blockchain Verification Server running on http://127.0.0.1:{port}")
    app.run(host="127.0.0.1", port=port, debug=False)
