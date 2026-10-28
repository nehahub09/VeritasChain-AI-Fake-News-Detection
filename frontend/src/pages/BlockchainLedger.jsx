import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  RefreshCw, 
  Award, 
  ExternalLink,
  Lock,
  Database
} from 'lucide-react';
import { fetchTransactions, verifyHashApi } from '../services/api';
import VerificationCertificate from '../components/VerificationCertificate';

export default function BlockchainLedger({ initialSearchHash }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearchHash || '');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);

  const loadLedger = async () => {
    setLoading(true);
    try {
      const res = await fetchTransactions(50);
      if (res.success) setTransactions(res.transactions);
    } catch (err) {
      console.error("Ledger fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLedger();
    if (initialSearchHash) {
      handleSearch(initialSearchHash);
    }
  }, [initialSearchHash]);

  const handleSearch = async (hashToSearch) => {
    const q = (hashToSearch || searchQuery).trim();
    if (!q) return;

    setSearching(true);
    setSearchError('');
    setSearchResult(null);

    try {
      const res = await verifyHashApi(q);
      if (res.success && res.verified) {
        setSearchResult(res);
      } else {
        setSearchError(res.message || 'No verification record found on the blockchain.');
      }
    } catch (err) {
      setSearchError('Error verifying hash with blockchain node.');
    } finally {
      setSearching(false);
    }
  };

  const copyText = (txt, id) => {
    navigator.clipboard.writeText(txt);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fadeIn pb-12">
      {/* Title */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Blockchain Verification & Ledger</h1>
            <p className="text-xs text-slate-400">
              Decentralized proof of news authenticity, Keccak-256 content hashes, and Ethereum smart contract receipts.
            </p>
          </div>
        </div>

        <button
          onClick={loadLedger}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Hash Verification Search Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0e1322] border border-cyan-500/30 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Verify News Hash or Transaction ID</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Keccak-256 / SHA-256</span>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Paste 0x... news content hash or transaction hash to verify immutability"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-extrabold text-xs transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {searching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>Verify on Blockchain</span>
          </button>
        </form>

        {searchError && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/50 text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}

        {/* Verification Success Box */}
        {searchResult && searchResult.record && (
          <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800/40">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>On-Chain Cryptographic Match Confirmed</span>
              </div>
              <button
                onClick={() => setSelectedCert(searchResult.record)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Certificate</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Headline:</span>
                <span className="font-semibold text-white">{searchResult.record.title}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Verdict & Probabilities:</span>
                <span className="font-mono font-bold text-slate-100">
                  {searchResult.record.verdict} (Real: {searchResult.record.real_percentage}%, Fake: {searchResult.record.fake_percentage}%)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Block Height:</span>
                <span className="font-mono text-cyan-300 font-bold">#{searchResult.record.block_number}</span>
              </div>
            </div>

            <div className="text-[11px] font-mono bg-black/40 p-3 rounded-xl border border-slate-800 break-all text-slate-300">
              <span className="text-slate-500 block">TRANSACTION HASH:</span>
              {searchResult.record.tx_hash}
            </div>
          </div>
        )}
      </div>

      {/* Immutable Ledger Table */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0e1322] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Public Immutable Ledger</h2>
            <p className="text-xs text-slate-400">All news claims committed to the Ethereum verification contract.</p>
          </div>
          <span className="text-xs text-cyan-400 font-mono font-semibold bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800/50">
            {transactions.length} Verified Blocks
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/80 text-slate-400 uppercase border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-3 px-4">Block #</th>
                <th className="py-3 px-3">Transaction Hash</th>
                <th className="py-3 px-3">Headline / Subject</th>
                <th className="py-3 px-3">Verdict</th>
                <th className="py-3 px-3">Scores</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
              {transactions.map((tx) => {
                const isReal = tx.verdict === 'REAL';
                const isFake = tx.verdict === 'FAKE';
                const badgeColor = isReal
                  ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40'
                  : isFake
                  ? 'text-rose-400 bg-rose-950/40 border-rose-800/40'
                  : 'text-amber-400 bg-amber-950/40 border-amber-800/40';

                return (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                      #{tx.block_number}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span>{tx.tx_hash.slice(0, 10)}...{tx.tx_hash.slice(-6)}</span>
                        <button
                          onClick={() => copyText(tx.tx_hash, tx.id)}
                          className="hover:text-cyan-400 text-slate-500"
                        >
                          {copiedHash === tx.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 max-w-xs truncate text-slate-200 font-semibold">
                      {tx.title || 'Untitled Claim'}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${badgeColor}`}>
                        {tx.verdict || 'UNVERIFIED'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs">
                      <span className="text-emerald-400">{tx.real_percentage || 50}%</span> / <span className="text-rose-400">{tx.fake_percentage || 50}%</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-emerald-400 inline-flex items-center gap-1 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Mined
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedCert({
                          title: tx.title,
                          media_type: tx.media_type || 'TEXT',
                          verdict: tx.verdict,
                          fake_percentage: tx.fake_percentage,
                          real_percentage: tx.real_percentage,
                          confidence: tx.confidence || 85.0,
                          news_hash: tx.news_hash,
                          tx_hash: tx.tx_hash,
                          block_number: tx.block_number
                        })}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-300 transition-colors"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Audit</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pop-up Certificate Modal */}
      {selectedCert && (
        <VerificationCertificate
          data={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
}
