import React, { useState } from 'react';
import { FileText, Sparkles, Send, Globe, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { analyzeTextApi } from '../services/api';
import ResultCard from '../components/ResultCard';

const SAMPLE_PRESETS = [
  {
    label: "Fake: 5G Mind Control Rumor",
    type: "fake",
    headline: "SHOCKING: Secret Government Document Leaked About 5G Mind Control Towers!",
    text: "Secret government document leaked! They don't want you to know the truth about 5G towers controlling everyone's mind! Wake up people! Share this before Big Pharma and the global elites take it down! Drinking lemon water destroys the microchips!",
    source_url: "http://truth-patriot-revealed.blogspot.com"
  },
  {
    label: "Real: Federal Reserve Rates",
    type: "real",
    headline: "Federal Reserve Adjusts Benchmark Rates Citing Stable Employment Indicators",
    text: "The Federal Reserve announced an adjustment to its benchmark interest rates by a quarter percentage point, citing steady employment data and ongoing efforts to guide annual inflation toward its target. The official statement was released following the conclusion of the monetary policy committee's two-day meeting in Washington.",
    source_url: "https://www.reuters.com/business/finance"
  },
  {
    label: "Unverified: Speculative Rumor",
    type: "unverified",
    headline: "Unconfirmed Claims of New Smartphone Battery Innovation Surface Online",
    text: "Online forums are circulating rumors that a tech startup might reveal a solid-state smartphone battery next month. No technical specifications, whitepapers, or patent filings have been made public yet.",
    source_url: "https://techforum-discussions.net/rumors"
  }
];

export default function TextAnalyzer() {
  const [headline, setHeadline] = useState('');
  const [text, setText] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handlePreset = (preset) => {
    setHeadline(preset.headline);
    setText(preset.text);
    setSourceUrl(preset.source_url);
    setResult(null);
    setError('');
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!headline.trim() && !text.trim()) {
      setError('Please provide a news headline or body text to analyze.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await analyzeTextApi({
        headline: headline.trim(),
        text: text.trim(),
        source_url: sourceUrl.trim()
      });

      if (res.success) {
        setResult(res);
      } else {
        setError(res.error || 'Failed to complete text analysis.');
      }
    } catch (err) {
      setError('Connection to analysis backend failed. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-12">
      {/* Page Title */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Text News Analyzer</h1>
            <p className="text-xs text-slate-400">
              Machine learning linguistic profiling, TF-IDF feature analysis, and sensationalism scoring.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Quick Fill */}
      <div className="p-4 rounded-2xl bg-[#0e1322] border border-slate-800">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quick Benchmark Presets:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePreset(p)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700 transition-all font-medium"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAnalyze} className="p-6 md:p-8 rounded-3xl bg-[#0e1322] border border-slate-800 shadow-xl space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            News Headline / Title
          </label>
          <input
            type="text"
            placeholder="e.g. Breakthrough in renewable hydrogen extraction announced by researchers..."
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Full Article Body or Claim Text
          </label>
          <textarea
            rows={5}
            placeholder="Paste the full text of the article, social media post, or messaging thread claim here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Source URL or Publishing Domain (Optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. https://www.reuters.com/world/article"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono text-xs"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-extrabold text-sm transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Computing NLP & Blockchain Proof...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Run AI Veracity Scan</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Result Display */}
      {result && <ResultCard result={result} title="Text Veracity Analysis" />}
    </div>
  );
}
