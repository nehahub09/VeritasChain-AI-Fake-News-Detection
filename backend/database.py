import sqlite3
import json
import time
from datetime import datetime
from config import Config

def get_db_connection():
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS news_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        news_hash TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        content_excerpt TEXT,
        media_type TEXT NOT NULL,
        verdict TEXT NOT NULL,
        fake_percentage REAL NOT NULL,
        real_percentage REAL NOT NULL,
        confidence REAL NOT NULL,
        explanation TEXT,
        factors_json TEXT,
        file_path TEXT,
        tx_hash TEXT,
        block_number INTEGER,
        created_at TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS blockchain_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tx_hash TEXT UNIQUE NOT NULL,
        news_hash TEXT NOT NULL,
        block_number INTEGER NOT NULL,
        gas_used INTEGER NOT NULL,
        signer_address TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (news_hash) REFERENCES news_records (news_hash)
    );
    """)

    conn.commit()

    # Pre-seed initial benchmark items if database is empty
    cursor.execute("SELECT COUNT(*) FROM news_records")
    if cursor.fetchone()[0] == 0:
        seed_benchmark_data(conn)

    conn.close()

def seed_benchmark_data(conn):
    cursor = conn.cursor()
    seeds = [
        (
            "0x89e2c4d9a117d3d198031ba048e7e127391dfcfcf9f67a29e92d775196f7c001",
            "WHO Confirms Updated Global Airborne Pathogen Surveillance Guidelines",
            "Officials from the World Health Organization confirmed an update to global pathogen monitoring protocols following a consultative committee meeting in Geneva. The recommendations standardize genomic sequencing reporting across member states.",
            "text",
            "REAL",
            12.5,
            87.5,
            94.0,
            "The content has been verified as REAL (87.5% probability) with 94.0% model confidence. The text exhibits neutral linguistic tone, standard journalistic syntax, consistent metadata, and lack of visual/audio tampering markers.",
            json.dumps({"sensationalism_score": 12.0, "source_credibility": 92.0, "sentiment_polarization": 15.0}),
            "",
            "0x5a18c9f28e2098b9e672f778a63118cf2330a11e892c5bb7190f231789c091a2",
            18459201,
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ),
        (
            "0x1f74a980c7d8721469032158019baf4109438917823fec9a1873426189a0b002",
            "SHOCKING: 5G Towers Secretly Emitting Mind-Control Waves Banned in Europe!",
            "Secret government document leaked! They don't want you to know the truth about 5G towers controlling everyone's mind! Wake up people! Share before it gets removed!",
            "text",
            "FAKE",
            91.4,
            8.6,
            96.2,
            "The content has been classified as FAKE (91.4% probability) with 96.2% model confidence. Key forensic flags: High sensationalist/clickbait rhetoric detected (91.0%); Extreme emotional polarization and provocative framing; Absence of verifiable citations, named sources, or institutional corroboration.",
            json.dumps({"sensationalism_score": 91.0, "source_credibility": 10.0, "sentiment_polarization": 94.0}),
            "",
            "0x7b29e0a13d817429b9e672f778a63118cf2330a11e892c5bb7190f231789c091b3",
            18459202,
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ),
        (
            "0x4c2810a9f3b8901247012358019baf4109438917823fec9a1873426189a0c003",
            "NASA Mars Perseverance Rover Discovers Hydrated Silica Deposits in Jezero",
            "Spectrometric analysis from the rover's Mastcam-Z instrument revealed concentrated deposits of hydrated silica along the ancient delta rim, suggesting prolonged aqueous activity during the Noachian epoch.",
            "image",
            "REAL",
            14.2,
            85.8,
            89.5,
            "The content has been verified as REAL (85.8% probability) with 89.5% model confidence. The image displays uniform baseline compression with zero Error Level Analysis (ELA) anomalies or splice artifacts.",
            json.dumps({"tamper_score": 11.4, "source_credibility": 90.0, "sensationalism_score": 14.0}),
            "/uploads/heatmaps/sample_real_mars.jpg",
            "0x9c30f1b24e928530c0f78308b74229da3441b22f903d6cc8201f342890d102c4",
            18459203,
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ),
        (
            "0x3d9170b8e2a7890136012448019baf4109438917823fec9a1873426189a0d004",
            "Viral Image: Alleged Spliced Explosion Photo Over Downtown Skyline",
            "Photographed explosion image circulating on social media claiming an emergency military drill took place without public notice.",
            "image",
            "FAKE",
            86.8,
            13.2,
            91.0,
            "The content has been classified as FAKE (86.8% probability) with 91.0% model confidence. Key forensic flags: Visual compression and edge inconsistency indicative of tampering (86.8%); Spliced contrast boundaries detected under Error Level Analysis.",
            json.dumps({"tamper_score": 86.8, "compression_variance": 42.1, "sensationalism_score": 75.0}),
            "/uploads/heatmaps/sample_fake_explosion.jpg",
            "0x8d41a2c35f039641d1a89419c85330eb4552c330a14e7dd9312a453901e213d5",
            18459204,
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ),
        (
            "0x6e0281c9f4b8901248012558019baf4109438917823fec9a1873426189a0e005",
            "Leaked Audio: Claim of Impending Global Currency Revaluation This Weekend",
            "Transcribed audio voice note circulating in messaging groups alleging all sovereign debts will be canceled midnight Sunday by secret executive order.",
            "audio",
            "FAKE",
            88.2,
            11.8,
            88.0,
            "The content has been classified as FAKE (88.2% probability) with 88.0% model confidence. High synthetic voice artifacts detected along with sensationalist financial panic claims.",
            json.dumps({"synthetic_voice_score": 78.4, "sensationalism_score": 88.0, "source_credibility": 12.0}),
            "",
            "0x2e52b3d46a140752e2b90520d96441fc5663d441b25f8ee0423b564012f324e6",
            18459205,
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ),
        (
            "0x9f1392da05c9012359012669019baf4109438917823fec9a1873426189a0f006",
            "Unconfirmed Video Clip: Unidentified Aerial Anomaly Over Coastal Bay",
            "Low-resolution amateur night video recording showing flashing luminescent anomalies moving in parabolic trajectory. Origin and sensor calibration unverified.",
            "video",
            "UNVERIFIED",
            51.5,
            48.5,
            38.0,
            "The content status is UNVERIFIED (Confidence: 38.0%). Low resolution and lack of corroborating telemetry preclude an authoritative veracity consensus.",
            json.dumps({"tamper_score": 35.0, "sensationalism_score": 45.0, "source_credibility": 40.0}),
            "",
            "0x1f63c4e57b251863f3c01631ea7552ad6774e552c36a9ff1534c675123a435f7",
            18459206,
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
    ]

    for s in seeds:
        cursor.execute("""
        INSERT INTO news_records (
            news_hash, title, content_excerpt, media_type, verdict,
            fake_percentage, real_percentage, confidence, explanation,
            factors_json, file_path, tx_hash, block_number, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, s)

        cursor.execute("""
        INSERT INTO blockchain_transactions (
            tx_hash, news_hash, block_number, gas_used, signer_address, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (s[11], s[0], s[12], 47218, "0x3A54C918e9Db8C581f1bE43818e692f801C8a178", "CONFIRMED_ON_CHAIN", s[13]))

    conn.commit()

def save_news_record(record_dict: dict) -> dict:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    INSERT OR REPLACE INTO news_records (
        news_hash, title, content_excerpt, media_type, verdict,
        fake_percentage, real_percentage, confidence, explanation,
        factors_json, file_path, tx_hash, block_number, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        record_dict["news_hash"],
        record_dict.get("title", "Untitled Content"),
        record_dict.get("content_excerpt", "")[:500],
        record_dict.get("media_type", "text"),
        record_dict["verdict"],
        record_dict["fake_percentage"],
        record_dict["real_percentage"],
        record_dict["confidence"],
        record_dict.get("explanation", ""),
        json.dumps(record_dict.get("factors", {})),
        record_dict.get("file_path", ""),
        record_dict.get("tx_hash", ""),
        record_dict.get("block_number", 0),
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))

    if record_dict.get("tx_hash"):
        cursor.execute("""
        INSERT OR REPLACE INTO blockchain_transactions (
            tx_hash, news_hash, block_number, gas_used, signer_address, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            record_dict["tx_hash"],
            record_dict["news_hash"],
            record_dict.get("block_number", 0),
            record_dict.get("gas_used", 47218),
            record_dict.get("signer_address", "0x3A54C918e9Db8C581f1bE43818e692f801C8a178"),
            record_dict.get("status", "CONFIRMED_ON_CHAIN"),
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ))

    conn.commit()
    conn.close()
    return record_dict

def get_stats() -> dict:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM news_records")
    total_news = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM news_records WHERE verdict = 'FAKE'")
    fake_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM news_records WHERE verdict = 'REAL'")
    real_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM news_records WHERE verdict = 'UNVERIFIED'")
    unverified_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM blockchain_transactions")
    total_tx = cursor.fetchone()[0]

    # Modality counts
    cursor.execute("SELECT media_type, COUNT(*) FROM news_records GROUP BY media_type")
    modalities = {row[0]: row[1] for row in cursor.fetchall()}

    # Calculate overall average percentage shares
    fake_pct = round((fake_count / total_news * 100), 1) if total_news > 0 else 0
    real_pct = round((real_count / total_news * 100), 1) if total_news > 0 else 0
    unverified_pct = round((unverified_count / total_news * 100), 1) if total_news > 0 else 0

    conn.close()

    return {
        "total_news_analyzed": total_news,
        "fake_count": fake_count,
        "real_count": real_count,
        "unverified_count": unverified_count,
        "fake_percentage": fake_pct,
        "real_percentage": real_pct,
        "unverified_percentage": unverified_pct,
        "total_blockchain_records": total_tx,
        "modality_breakdown": {
            "text": modalities.get("text", 0),
            "image": modalities.get("image", 0),
            "audio": modalities.get("audio", 0),
            "video": modalities.get("video", 0)
        }
    }

def get_recent_records(limit=20) -> list:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM news_records ORDER BY id DESC LIMIT ?
    """, (limit,))
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows

def get_record_by_hash(news_hash: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM news_records WHERE news_hash = ? OR tx_hash = ?
    """, (news_hash.strip(), news_hash.strip()))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_all_transactions(limit=50) -> list:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT t.*, r.title, r.verdict, r.media_type, r.fake_percentage, r.real_percentage, r.confidence
    FROM blockchain_transactions t
    LEFT JOIN news_records r ON t.news_hash = r.news_hash
    ORDER BY t.id DESC LIMIT ?
    """, (limit,))
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows
