import React, { useState } from 'react';
import { Video, Upload, RefreshCw, AlertCircle, Film, Cpu, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { analyzeVideoApi } from '../services/api';
import ResultCard from '../components/ResultCard';

export default function VideoAnalyzer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [contextClaim, setContextClaim] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setResult(null);
      setError('');
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please choose or drop a video file (MP4, WEBM, MOV).');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('context_claim', contextClaim.trim());

      const res = await analyzeVideoApi(formData);
      if (res.success) {
        setResult(res);
      } else {
        setError(res.error || 'Video analysis failed.');
      }
    } catch (err) {
      setError('Connection to backend failed. Verify Flask server is active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-12">
      {/* Title */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Video News Analyzer</h1>
            <p className="text-xs text-slate-400">
              OpenCV keyframe extraction, frame-by-frame tamper detection, audio extraction & multi-modal fusion.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Box */}
      <form onSubmit={handleAnalyze} className="p-6 md:p-8 rounded-3xl bg-[#0e1322] border border-slate-800 shadow-xl space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Upload Video File (MP4, WEBM, MOV, MKV)
          </label>
          <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-3xl p-8 text-center transition-colors bg-slate-900/50 cursor-pointer relative">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center">
              <div className="p-4 rounded-2xl bg-slate-800 text-cyan-400 mb-3">
                <Film className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                {selectedFile ? selectedFile.name : 'Click or drag & drop a video file here'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Supports MP4, WEBM, MOV, AVI up to 100MB</p>
            </div>
          </div>
        </div>

        {/* Video Player Preview */}
        {videoUrl && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 block">{selectedFile.name} Preview:</span>
            <div className="aspect-video max-h-72 w-full rounded-xl bg-black overflow-hidden flex items-center justify-center border border-slate-800">
              <video controls src={videoUrl} className="max-h-full max-w-full" />
            </div>
          </div>
        )}

        {/* Claim context */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Claim Description or Video Context (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Viral video claiming to depict an unannounced military exercise..."
            value={contextClaim}
            onChange={(e) => setContextClaim(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !selectedFile}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-extrabold text-sm transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Extracting Keyframes & Auditing Multi-modal Signals...</span>
              </>
            ) : (
              <>
                <Film className="w-4 h-4" />
                <span>Analyze Video Forensics</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Extracted Keyframe Timeline Strip */}
      {result && result.analysis && result.analysis.keyframes && result.analysis.keyframes.length > 0 && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#0e1322] border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Extracted Keyframes & Per-Frame Tamper Scores</span>
            </h3>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/50">
              {result.analysis.keyframes.length} Frames Sampled
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {result.analysis.keyframes.map((kf, i) => {
              const isTampered = kf.tamper_score >= 55.0;

              return (
                <div key={i} className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="aspect-video w-full rounded-xl bg-black overflow-hidden flex items-center justify-center border border-slate-800">
                    <img src={kf.frame_url} alt={`Frame ${kf.frame_index}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">@{kf.timestamp_sec}s</span>
                    <span className={`font-bold ${isTampered ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {kf.tamper_score}%
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">
                    Sharpness: {kf.sharpness_var}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Result Card */}
      {result && <ResultCard result={result} title="Video Veracity Assessment" />}
    </div>
  );
}
