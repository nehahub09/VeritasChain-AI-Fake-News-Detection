import React, { useState } from 'react';
import { Mic, Upload, RefreshCw, AlertCircle, Volume2, FileAudio, Waves, Cpu } from 'lucide-react';
import { analyzeAudioApi } from '../services/api';
import ResultCard from '../components/ResultCard';

export default function AudioAnalyzer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [contextClaim, setContextClaim] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAudioUrl(URL.createObjectURL(file));
      setResult(null);
      setError('');
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please choose or drop an audio file (WAV, MP3, OGG).');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('audio', selectedFile);
      formData.append('context_claim', contextClaim.trim());

      const res = await analyzeAudioApi(formData);
      if (res.success) {
        setResult(res);
      } else {
        setError(res.error || 'Audio analysis failed.');
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
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Audio News Analyzer</h1>
            <p className="text-xs text-slate-400">
              Speech-to-Text (STT) transcription, acoustic synthetic voice detection & claim NLP analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Box */}
      <form onSubmit={handleAnalyze} className="p-6 md:p-8 rounded-3xl bg-[#0e1322] border border-slate-800 shadow-xl space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Upload Audio Recording (WAV, MP3, OGG, M4A)
          </label>
          <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-3xl p-8 text-center transition-colors bg-slate-900/50 cursor-pointer relative">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center">
              <div className="p-4 rounded-2xl bg-slate-800 text-cyan-400 mb-3">
                <FileAudio className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                {selectedFile ? selectedFile.name : 'Click or drag & drop an audio clip here'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Supports WAV, MP3, OGG, FLAC up to 50MB</p>
            </div>
          </div>
        </div>

        {/* Audio Player Preview */}
        {audioUrl && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">{selectedFile.name}</span>
                <span className="text-[11px] text-slate-400 font-mono">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>
            <audio controls src={audioUrl} className="w-full sm:w-72 h-10 rounded-lg" />
          </div>
        )}

        {/* Claim context */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Context Claim or Alleged Speaker (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Purported leaked phone call between central bank governors..."
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
                <span>Transcribing Speech & Analyzing Waveform...</span>
              </>
            ) : (
              <>
                <Waves className="w-4 h-4" />
                <span>Analyze Audio Forensics</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Transcription and Acoustic breakdown if result exists */}
      {result && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#0e1322] border border-slate-800 shadow-xl space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Speech-to-Text & Acoustic Metrics</span>
          </h3>

          {/* Transcription */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Automated Speech-to-Text Transcription:
            </span>
            <div className="p-3 rounded-xl bg-black/40 border border-slate-800 text-xs font-mono text-cyan-300 leading-relaxed">
              "{result.analysis.transcription || 'No speech detected.'}"
            </div>
          </div>

          {/* Acoustic parameters */}
          {result.analysis.acoustics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Clip Duration</span>
                <span className="text-lg font-mono font-bold text-white block mt-1">
                  {result.analysis.acoustics.duration_seconds}s
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Sample Rate</span>
                <span className="text-lg font-mono font-bold text-cyan-400 block mt-1">
                  {result.analysis.acoustics.sample_rate} Hz
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Synthetic Voice Risk</span>
                <span className="text-lg font-mono font-bold text-amber-400 block mt-1">
                  {result.analysis.acoustics.synthetic_voice_score}%
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Audio Inconsistency</span>
                <span className="text-lg font-mono font-bold text-indigo-400 block mt-1">
                  {result.analysis.acoustics.audio_inconsistency}%
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Result Card */}
      {result && <ResultCard result={result} title="Audio Veracity Assessment" />}
    </div>
  );
}
