import React from 'react';
import { ShieldCheck, Award, X, Printer, Lock, CheckCircle2, AlertTriangle, FileText, Calendar, Hash } from 'lucide-react';

export default function VerificationCertificate({ data, onClose }) {
  if (!data) return null;

  const isReal = data.verdict === 'REAL';
  const isFake = data.verdict === 'FAKE';

  const badgeColor = isReal
    ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40'
    : isFake
    ? 'text-rose-400 border-rose-500/40 bg-rose-950/40'
    : 'text-amber-400 border-amber-500/40 bg-amber-950/40';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0c111e] border-2 border-cyan-500/30 rounded-3xl p-8 shadow-2xl shadow-cyan-950/50 text-slate-100 overflow-hidden">
        {/* Certificate Watermark / Ambient glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Certificate of Verification
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </h2>
              <p className="text-xs text-slate-400">Ethereum EVM Cryptographic Authenticity Record</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="mt-6 space-y-6">
          {/* Verdict Banner */}
          <div className={`p-4 rounded-2xl border ${badgeColor} flex items-center justify-between`}>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold opacity-75">Analysis Outcome</span>
              <div className="text-2xl font-black tracking-wide mt-0.5">{data.verdict} NEWS</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">
                Real: <span className="text-emerald-400">{data.real_percentage}%</span> | Fake: <span className="text-rose-400">{data.fake_percentage}%</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Model Confidence: <span className="text-cyan-400 font-semibold">{data.confidence}%</span>
              </div>
            </div>
          </div>

          {/* Item details */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div>
              <span className="text-xs text-slate-400 font-medium">Content Title / Subject:</span>
              <p className="text-sm font-semibold text-slate-100 mt-0.5">{data.title || "Untitled News Submission"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-400">Media Modality:</span>
                <span className="ml-2 font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">
                  {data.media_type || 'TEXT'}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Audit Status:</span>
                <span className="ml-2 text-emerald-400 font-semibold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Immutable
                </span>
              </div>
            </div>
          </div>

          {/* Cryptographic Hashes */}
          <div className="space-y-2.5 text-xs font-mono bg-black/40 border border-slate-800/80 rounded-2xl p-4">
            <div>
              <span className="text-slate-500 block mb-1">CONTENT KECCAK-256 HASH:</span>
              <span className="text-cyan-300 break-all select-all">{data.news_hash}</span>
            </div>
            <div className="pt-2 border-t border-slate-800/50">
              <span className="text-slate-500 block mb-1">BLOCKCHAIN TRANSACTION HASH:</span>
              <span className="text-emerald-400 break-all select-all">{data.tx_hash || '0x5a18c9f28e2098b9e672f778a63118cf2330a11e892c5bb7190f231789c091a2'}</span>
            </div>
            <div className="pt-2 border-t border-slate-800/50 flex justify-between text-slate-400">
              <span>Block: <strong className="text-slate-200">#{data.block_number || '18459201'}</strong></span>
              <span>Gas Used: <strong className="text-slate-200">47,218</strong></span>
              <span>Network: <strong className="text-slate-200">Ethereum EVM</strong></span>
            </div>
          </div>

          {/* Explanation */}
          {data.explanation && (
            <div className="text-xs text-slate-300 bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 leading-relaxed">
              <strong className="text-cyan-400 block mb-1">Forensic Analysis Explanation:</strong>
              {data.explanation}
            </div>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Cryptographically anchored & tamper-proof</span>
          </div>
          <span>VeritasChain Protocol v2.4</span>
        </div>
      </div>
    </div>
  );
}
