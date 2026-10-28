import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, ExternalLink } from 'lucide-react';

export default function BlockchainBadge({ txHash, blockNumber, status = "CONFIRMED_ON_CHAIN" }) {
  const [copied, setCopied] = useState(false);

  if (!txHash) return null;

  const shortTx = `${txHash.slice(0, 8)}...${txHash.slice(-6)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-cyan-400 text-xs font-mono">
      <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
      <span className="text-slate-300 font-medium">Block #{blockNumber || '18459200'}</span>
      <span className="text-slate-500">•</span>
      <span className="text-cyan-300 font-semibold">{shortTx}</span>
      <button
        onClick={copyToClipboard}
        title="Copy Transaction Hash"
        className="p-1 hover:text-white transition-colors text-slate-400"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
