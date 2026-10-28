import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Award, 
  Info, 
  Cpu, 
  Activity, 
  FileSearch,
  ExternalLink
} from 'lucide-react';
import BlockchainBadge from './BlockchainBadge';
import VerificationCertificate from './VerificationCertificate';

export default function ResultCard({ result, title = "Analysis Outcome" }) {
  const [showCertificate, setShowCertificate] = useState(false);

  if (!result) return null;

  const analysis = result.analysis || result;
  const blockchain = result.blockchain || {};
  const verdict = analysis.verdict || "UNVERIFIED";
  const fakePct = analysis.fake_percentage ?? 50.0;
  const realPct = analysis.real_percentage ?? 50.0;
  const confidence = analysis.confidence ?? 75.0;
  const explanation = analysis.explanation || "";
  const factors = analysis.factors || {};

  const isReal = verdict === "REAL";
  const isFake = verdict === "FAKE";
  const isUnverified = verdict === "UNVERIFIED";

  // Banner styles
  const cardBorder = isReal 
    ? "border-emerald-500/40 shadow-emerald-950/20" 
    : isFake 
    ? "border-rose-500/40 shadow-rose-950/20" 
    : "border-amber-500/40 shadow-amber-950/20";

  const verdictBg = isReal
    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    : isFake
    ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
    : "bg-amber-500/10 text-amber-400 border-amber-500/30";

  const VerdictIcon = isReal ? CheckCircle2 : isFake ? AlertTriangle : HelpCircle;

  return (
    <>
      <div className={`mt-6 p-6 md:p-8 rounded-3xl bg-[#0e1322] border-2 ${cardBorder} shadow-2xl relative overflow-hidden transition-all duration-300 animate-fadeIn`}>
        {/* Top glow */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${isReal ? 'bg-emerald-500' : isFake ? 'bg-rose-500' : 'bg-amber-500'}`} />

        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${verdictBg}`}>
              <VerdictIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Veracity Assessment</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-cyan-400 font-mono uppercase">{analysis.modality || 'MULTIMODAL'}</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white mt-0.5 flex items-center gap-3">
                {verdict} NEWS
              </h2>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowCertificate(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-semibold transition-all hover:scale-105"
            >
              <Award className="w-4 h-4" />
              <span>View On-Chain Certificate</span>
            </button>
          </div>
        </div>

        {/* Dual Probabilities Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-baseline mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-300">Veracity Distribution</span>
              <span className="text-xs text-slate-500">(Calculated from AI Feature Vectors)</span>
            </div>
            <div className="text-sm font-mono font-bold flex gap-4">
              <span className="text-rose-400">Fake News: {fakePct}%</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400">Real News: {realPct}%</span>
            </div>
          </div>

          {/* Two-Tone Progress Bar */}
          <div className="h-4 w-full rounded-full bg-slate-900 border border-slate-800 overflow-hidden flex shadow-inner">
            <div 
              style={{ width: `${fakePct}%` }}
              className="bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-1000 relative group"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div 
              style={{ width: `${realPct}%` }}
              className="bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000 relative group"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Distinguishing Confidence vs Probability Banner */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Model Confidence</span>
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-cyan-300 font-mono">{confidence}%</span>
              <span className="text-xs text-slate-400">
                {confidence >= 80 ? 'High Certainty' : confidence >= 50 ? 'Moderate Certainty' : 'Low Evidence'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Epistemic certainty based on evidence density, signal congruence, and sensor clarity.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Factual Probability</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={`text-2xl font-black font-mono ${isReal ? 'text-emerald-400' : isFake ? 'text-rose-400' : 'text-amber-400'}`}>
                {isReal ? realPct : fakePct}%
              </span>
              <span className="text-xs text-slate-400">
                {isReal ? 'Authentic' : isFake ? 'Deceptive' : 'Inconclusive'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Calculated statistical likelihood that content is factually true vs. fabricated.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Blockchain Audit</span>
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="mt-2">
              <BlockchainBadge 
                txHash={blockchain.tx_hash || result.tx_hash} 
                blockNumber={blockchain.block_number || result.block_number} 
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              Immutable SHA-256 state anchored into Ethereum smart contract.
            </p>
          </div>
        </div>

        {/* Forensic Analysis Explanation */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <div className="flex items-center gap-2 mb-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <FileSearch className="w-4 h-4" />
            <span>Forensic Analysis Explanation</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-normal">
            {explanation}
          </p>
        </div>

        {/* Factor Breakdown Bars */}
        {Object.keys(factors).length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">
              Extracted Forensic Factor Scores (0 - 100)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {factors.sensationalism_score !== undefined && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Sensationalism</span>
                    <span className="font-mono font-bold text-rose-400">{factors.sensationalism_score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${factors.sensationalism_score}%` }} className="bg-rose-500 h-full rounded-full" />
                  </div>
                </div>
              )}

              {factors.source_credibility !== undefined && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Credibility Index</span>
                    <span className="font-mono font-bold text-emerald-400">{factors.source_credibility}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${factors.source_credibility}%` }} className="bg-emerald-500 h-full rounded-full" />
                  </div>
                </div>
              )}

              {factors.tamper_score !== undefined && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Tamper Anomaly</span>
                    <span className="font-mono font-bold text-amber-400">{factors.tamper_score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${factors.tamper_score}%` }} className="bg-amber-500 h-full rounded-full" />
                  </div>
                </div>
              )}

              {factors.synthetic_voice_score !== undefined && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Synthetic Voice</span>
                    <span className="font-mono font-bold text-indigo-400">{factors.synthetic_voice_score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${factors.synthetic_voice_score}%` }} className="bg-indigo-500 h-full rounded-full" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pop-up Certificate Modal */}
      {showCertificate && (
        <VerificationCertificate
          data={{
            title: result.title || result.headline || "Analyzed News Item",
            media_type: analysis.modality || "TEXT",
            verdict: verdict,
            fake_percentage: fakePct,
            real_percentage: realPct,
            confidence: confidence,
            news_hash: result.news_hash,
            tx_hash: blockchain.tx_hash || result.tx_hash,
            block_number: blockchain.block_number || result.block_number,
            explanation: explanation
          }}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </>
  );
}
