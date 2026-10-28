import React, { useState, useEffect } from 'react';
import { Code2, ShieldCheck, Copy, Check, FileCode, Layers, ExternalLink, Cpu } from 'lucide-react';
import { fetchContractInfo } from '../services/api';

export default function SmartContractView() {
  const [contractData, setContractData] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAbi, setCopiedAbi] = useState(false);
  const [activeTab, setActiveTab] = useState('solidity'); // 'solidity' | 'abi'

  useEffect(() => {
    fetchContractInfo().then(data => {
      setContractData(data);
    }).catch(err => console.error(err));
  }, []);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedAbi(true);
      setTimeout(() => setCopiedAbi(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-12">
      {/* Title */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Smart Contract & ABI Inspector</h1>
            <p className="text-xs text-slate-400">
              Solidity implementation, compiler specification, and JSON ABI interface.
            </p>
          </div>
        </div>
      </div>

      {/* Contract Metadata Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Contract Address</span>
          <span className="text-xs font-mono font-bold text-cyan-300 block mt-1 break-all">
            {contractData?.contract_address || '0x71C8395B3045239a7b98dF291307b22Fce387062'}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Solidity Compiler</span>
          <span className="text-xs font-mono font-bold text-emerald-400 block mt-1">
            v0.8.20 + commit.a1b79de6
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Target Network</span>
          <span className="text-xs font-mono font-bold text-indigo-400 block mt-1">
            Ethereum (EVM Compatible / Sepolia)
          </span>
        </div>
      </div>

      {/* Code Viewer Container */}
      <div className="rounded-3xl bg-[#0e1322] border border-slate-800 shadow-xl overflow-hidden">
        {/* Sub-tabs */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('solidity')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'solidity'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-800/60'
              }`}
            >
              NewsVerification.sol
            </button>
            <button
              onClick={() => setActiveTab('abi')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'abi'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-800/60'
              }`}
            >
              Contract ABI (JSON)
            </button>
          </div>

          <button
            onClick={() => {
              if (activeTab === 'solidity') {
                copyToClipboard(contractData?.solidity_code || '', 'code');
              } else {
                copyToClipboard(JSON.stringify(contractData?.abi || [], null, 2), 'abi');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono transition-colors"
          >
            {(activeTab === 'solidity' ? copiedCode : copiedAbi) ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy {activeTab === 'solidity' ? 'Solidity' : 'ABI'}</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="p-6 overflow-x-auto max-h-[500px]">
          {activeTab === 'solidity' ? (
            <pre className="text-xs font-mono text-cyan-200 leading-relaxed">
              <code>{contractData?.solidity_code || '// Loading contract source...'}</code>
            </pre>
          ) : (
            <pre className="text-xs font-mono text-emerald-300 leading-relaxed">
              <code>{JSON.stringify(contractData?.abi || [], null, 2)}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
