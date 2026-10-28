# Windows VS Code Setup & Developer Guide

This guide walks you through setting up, running, and testing the **AI Fake News Detection System Using Blockchain** in Visual Studio Code on Windows.

---

## 🛠️ Step 1: Open the Project in VS Code

1. Launch **Visual Studio Code**.
2. Go to **File -> Open Folder...** and select:
   ```
   C:\Users\SUDARSH\OneDrive\Desktop\fake
   ```
3. Open a new terminal in VS Code:
   `Terminal -> New Terminal` (or press ``Ctrl + ` ``).

---

## 📦 Step 2: Verify Python & Node.js

In the VS Code terminal, verify your environment:
```powershell
python --version
node -v
npm -v
```

All three must be installed and accessible.

---

## 🐍 Step 3: Start the Backend (Terminal 1)

1. Navigate to the `backend` folder:
   ```powershell
   cd backend
   ```
2. The core dependencies (`Flask`, `flask-cors`, `scikit-learn`, `opencv-python`, `pillow`, `SpeechRecognition`, `web3`, `pytesseract`) are already installed. If running in a new virtual environment, run:
   ```powershell
   pip install -r requirements.txt
   ```
3. Start the Flask API server:
   ```powershell
   python app.py
   ```
You will see:
```
🚀 AI Fake News Detection & Blockchain Verification Server running on http://127.0.0.1:5000
```

---

## ⚛️ Step 4: Start the Frontend (Terminal 2)

1. In VS Code, split your terminal or open a second terminal tab by clicking the `+` button in the terminal panel.
2. Navigate to the `frontend` directory:
   ```powershell
   cd frontend
   ```
3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
You will see:
```
  VITE v5.4.21  ready in 320 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🌐 Step 5: Open the Application

Open your browser and navigate to:
[http://localhost:5173](http://localhost:5173)

You will see the executive dashboard with real-time statistics, donut charts, and the live blockchain verification status.

---

## 🧪 Step 6: How to Test Each Feature

### 1. Text Analysis
- Click **Text News Analyzer** on the sidebar.
- Click any preset button (e.g. **Fake: 5G Mind Control Rumor** or **Real: Federal Reserve Rates**).
- Click **Run AI Veracity Scan**.
- Inspect:
  - Percentage outputs (e.g. Fake News: 91.4%, Real News: 8.6%).
  - Epistemic Confidence rating (e.g. 96.2%).
  - Forensic factors breakdown.
  - Click **View On-Chain Certificate** to display the cryptographic Certificate of Authenticity.

### 2. Image Analysis (OCR & ELA Tamper Detection)
- Click **Image News Analyzer** on the sidebar.
- Click the upload box and select `backend\uploads\sample_fake_explosion.jpg`.
- Click **Analyze Image Forensics**.
- Inspect:
  - Error Level Analysis (ELA) heatmap with glowing manipulation hotspots.
  - OCR text extracted from the graphic.
  - On-chain transaction proof.

### 3. Audio Analysis (Speech-to-Text)
- Click **Audio News Analyzer** on the sidebar.
- Upload `backend\uploads\audio\sample_audio_announcement.wav`.
- Click **Analyze Audio Forensics**.
- Inspect:
  - Built-in audio playback.
  - Speech-to-Text transcription.
  - Synthetic cloned voice score.

### 4. Video Analysis (OpenCV Keyframes)
- Click **Video News Analyzer** on the sidebar.
- Upload `backend\uploads\videos\sample_video_clip.mp4`.
- Click **Analyze Video Forensics**.
- Inspect:
  - Keyframe timeline gallery with individual frame tamper scores.
  - Composite multi-modal veracity verdict.

### 5. Blockchain Verification Portal
- Click **Blockchain Verification** on the sidebar.
- Paste any news hash (e.g., `0x89e2c4d9a117d3d198031ba048e7e127391dfcfcf9f67a29e92d775196f7c001`).
- Click **Verify on Blockchain**.
- The system checks the Keccak-256 hash against the immutable ledger and verifies zero tampering.

### 6. Solidity Smart Contract & ABI
- Click **Smart Contract & ABI** on the sidebar to inspect the full Solidity code of `NewsVerification.sol` and the JSON ABI.

---

## 🚀 Single-Click Option: `start_all.bat`

You can also start both servers at any time by double-clicking `start_all.bat` located in the root folder.
