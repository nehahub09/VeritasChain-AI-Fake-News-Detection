import React, { useState } from 'react';
import { Image as ImageIcon, Upload, RefreshCw, AlertCircle, FileSearch, Eye, ShieldAlert, Cpu } from 'lucide-react';
import { analyzeImageApi } from '../services/api';
import ResultCard from '../components/ResultCard';

export default function ImageAnalyzer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError('');
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please choose or drop an image file to analyze.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('caption', caption.trim());

      const res = await analyzeImageApi(formData);
      if (res.success) {
        setResult(res);
      } else {
        setError(res.error || 'Failed to complete image analysis.');
      }
    } catch (err) {
      setError('Connection to backend failed. Please verify Flask server is running.');
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
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Image News Analyzer</h1>
            <p className="text-xs text-slate-400">
              Optical Character Recognition (OCR) text extraction & Error Level Analysis (ELA) tampering forensics.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Box */}
      <form onSubmit={handleAnalyze} className="p-6 md:p-8 rounded-3xl bg-[#0e1322] border border-slate-800 shadow-xl space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Upload Image File (PNG, JPG, WEBP)
          </label>
          <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-3xl p-8 text-center transition-colors bg-slate-900/50 cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center">
              <div className="p-4 rounded-2xl bg-slate-800 text-cyan-400 mb-3">
                <Upload className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                {selectedFile ? selectedFile.name : 'Click or drag & drop an image here'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, JPEG, WEBP up to 25MB</p>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Accompanying Headline or Social Media Caption (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Photo allegedly showing flooded downtown avenue during recent hurricane..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
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
                <span>Running Computer Vision & OCR...</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Analyze Image Forensics</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Side-by-side Visual Inspection if result exists */}
      {result && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#0e1322] border border-slate-800 shadow-xl space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Forensic Computer Vision Comparison</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Image */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Original Ingested Image</span>
                <span className="text-[10px] font-mono text-slate-500">RAW FILE</span>
              </div>
              <div className="aspect-video w-full rounded-xl bg-black overflow-hidden flex items-center justify-center border border-slate-800">
                <img
                  src={result.file_url || previewUrl}
                  alt="Original"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>

            {/* ELA Tamper Heatmap */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Error Level Analysis (ELA) Heatmap</span>
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-bold">
                  Tamper: {result.analysis.forensics.tamper_score}%
                </span>
              </div>
              <div className="aspect-video w-full rounded-xl bg-black overflow-hidden flex items-center justify-center border border-slate-800">
                {result.analysis.forensics.ela_heatmap_url ? (
                  <img
                    src={result.analysis.forensics.ela_heatmap_url}
                    alt="ELA Heatmap"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-500">ELA Heatmap generated</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Bright hot spots indicate divergent compression anomalies where content was spliced or photoshopped.
              </p>
            </div>
          </div>

          {/* Extracted OCR Text Box */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              <FileSearch className="w-3.5 h-3.5 text-cyan-400" />
              <span>Extracted OCR Embedded Text:</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-slate-800/80 text-xs font-mono text-cyan-200 break-words">
              {result.analysis.ocr_text || 'No text elements detected in image.'}
            </div>
          </div>
        </div>
      )}

      {/* Result Card */}
      {result && <ResultCard result={result} title="Image Veracity Assessment" />}
    </div>
  );
}
