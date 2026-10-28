import React, { useState } from 'react';
import { ShieldCheck, Search, Database, Layers, Radio, ExternalLink } from 'lucide-react';

export default function Navbar({ onSearchHash, activeTab, setActiveTab }) {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchHash(searchInput.trim());
      setActiveTab('blockchain');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080b12]/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 shadow-lg shadow-cyan-500/20 text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">VeritasChain</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">AI Multi-Modal Fake News Detection & Blockchain Verification</p>
          </div>
        </div>

        {/* Global Hash Lookup Search */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative w-80 lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Keccak-256 or Tx Hash..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
          />
        </form>

        {/* Right Status Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium hidden sm:inline">EVM Ledger Active</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Port 5000 / 5173</span>
          </div>
        </div>
      </div>
    </header>
  );
}
