import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Mic, 
  Video, 
  ShieldCheck, 
  Code2,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'text', label: 'Text News Analyzer', icon: FileText, badge: 'NLP / ML' },
    { id: 'image', label: 'Image News Analyzer', icon: ImageIcon, badge: 'OCR + ELA' },
    { id: 'audio', label: 'Audio News Analyzer', icon: Mic, badge: 'STT' },
    { id: 'video', label: 'Video News Analyzer', icon: Video, badge: 'CV' },
    { id: 'blockchain', label: 'Blockchain Verification', icon: ShieldCheck, badge: 'On-Chain' },
    { id: 'contract', label: 'Smart Contract & ABI', icon: Code2, badge: 'Solidity' }
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-[#080b12] p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Navigation Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600/20 to-indigo-600/20 text-cyan-400 border border-cyan-500/40 shadow-lg shadow-cyan-950/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Protocol Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900/40 border border-indigo-900/40 text-xs">
        <div className="flex items-center gap-2 text-indigo-400 font-bold mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Veritas Protocol</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Zero-trust news verification backed by decentralized smart contracts.
        </p>
      </div>
    </aside>
  );
}
