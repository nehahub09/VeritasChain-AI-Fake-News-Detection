import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  TrendingUp, 
  BarChart3, 
  Layers, 
  Search,
  ExternalLink,
  Award,
  RefreshCw
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';
import StatCard from '../components/StatCard';
import VerificationCertificate from '../components/VerificationCertificate';
import BlockchainBadge from '../components/BlockchainBadge';
import { fetchStats, fetchHistory } from '../services/api';

export default function DashboardOverview({ setActiveTab, onSelectRecord }) {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterVerdict, setFilterVerdict] = useState('ALL');
  const [selectedCert, setSelectedCert] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, histRes] = await Promise.all([fetchStats(), fetchHistory(20)]);
      if (statsRes.success) setStats(statsRes.data);
      if (histRes.success) setHistory(histRes.records);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pieData = stats ? [
    { name: 'Fake News', value: stats.fake_count || 1, color: '#ef4444' },
    { name: 'Real News', value: stats.real_count || 1, color: '#10b981' },
    { name: 'Unverified', value: stats.unverified_count || 1, color: '#f59e0b' }
  ] : [];

  const modalityData = stats ? [
    { name: 'Text', count: stats.modality_breakdown.text },
    { name: 'Image', count: stats.modality_breakdown.image },
    { name: 'Audio', count: stats.modality_breakdown.audio },
    { name: 'Video', count: stats.modality_breakdown.video }
  ] : [];

  // Simulated 7-day trend
  const trendData = [
    { day: 'Mon', fake: 12, real: 28 },
    { day: 'Tue', fake: 18, real: 34 },
    { day: 'Wed', fake: 24, real: 30 },
    { day: 'Thu', fake: 32, real: 45 },
    { day: 'Fri', fake: 29, real: 52 },
    { day: 'Sat', fake: 41, real: 48 },
    { day: 'Sun', fake: 35, real: 60 }
  ];

  const filteredHistory = history.filter(item => {
    if (filterVerdict === 'ALL') return true;
    return item.verdict === filterVerdict;
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Threat Intelligence & Veracity Dashboard
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Real-time multi-modal AI detection metrics cryptographically anchored on Ethereum.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Sync Ledger</span>
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-xs font-bold text-black transition-all shadow-lg shadow-cyan-500/20"
          >
            <span>+ Scan New Content</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Analyzed"
          value={stats ? stats.total_news_analyzed : '--'}
          subtitle="Multi-modal Submissions"
          icon={FileCheck2}
          color="cyan"
        />
        <StatCard
          title="Fake News Rate"
          value={stats ? `${stats.fake_percentage}%` : '--'}
          subtitle={`${stats ? stats.fake_count : 0} Deceptive Items`}
          icon={AlertTriangle}
          color="rose"
          badge="High Risk"
        />
        <StatCard
          title="Real News Rate"
          value={stats ? `${stats.real_percentage}%` : '--'}
          subtitle={`${stats ? stats.real_count : 0} Verified Authentic`}
          icon={CheckCircle2}
          color="emerald"
          badge="Legitimate"
        />
        <StatCard
          title="Unverified Rate"
          value={stats ? `${stats.unverified_percentage}%` : '--'}
          subtitle={`${stats ? stats.unverified_count : 0} Ambiguous`}
          icon={HelpCircle}
          color="amber"
        />
        <StatCard
          title="On-Chain Hashes"
          value={stats ? stats.total_blockchain_records : '--'}
          subtitle="Keccak-256 Proofs"
          icon={ShieldCheck}
          color="indigo"
          badge="EVM Immutable"
        />
      </div>

      {/* Interactive Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Veracity Distribution Pie Chart */}
        <div className="p-6 rounded-3xl bg-[#0e1322] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Veracity Ratio</h3>
              <span className="text-xs text-slate-500 font-mono">Real vs Fake</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Overall distribution across all analyzed submissions.</p>
          </div>

          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0e1322" strokeWidth={3} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0c111e', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {stats && (
              <div className="absolute text-center pointer-events-none">
                <span className="text-2xl font-black text-white">{stats.total_news_analyzed}</span>
                <span className="block text-[10px] text-slate-400 uppercase">Records</span>
              </div>
            )}
          </div>

          <div className="flex justify-around pt-4 border-t border-slate-800 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-slate-300">Fake ({stats ? stats.fake_percentage : 0}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-300">Real ({stats ? stats.real_percentage : 0}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-300">Unverified ({stats ? stats.unverified_percentage : 0}%)</span>
            </div>
          </div>
        </div>

        {/* Modality Bar Chart */}
        <div className="p-6 rounded-3xl bg-[#0e1322] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Modality Distribution</h3>
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xs text-slate-400 mb-4">Volume of media ingested per sensor pipeline.</p>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modalityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0c111e', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
            <span>Text, Image, Audio, Video</span>
            <span className="text-cyan-400 font-mono font-bold">4 AI Modalities</span>
          </div>
        </div>

        {/* 7-Day Trend Chart */}
        <div className="p-6 rounded-3xl bg-[#0e1322] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Weekly Ingestion Trend</h3>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-400 mb-4">Cumulative authentic vs deceptive submissions over time.</p>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFake" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0c111e', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="real" stroke="#10b981" fillOpacity={1} fill="url(#colorReal)" />
                <Area type="monotone" dataKey="fake" stroke="#ef4444" fillOpacity={1} fill="url(#colorFake)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs flex justify-between">
            <span className="text-emerald-400 font-medium">● Authentic Claims</span>
            <span className="text-rose-400 font-medium">● Deceptive Clustered</span>
          </div>
        </div>
      </div>

      {/* Recent Analysis & Audit Table */}
      <div className="p-6 rounded-3xl bg-[#0e1322] border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Recent Content Verifications</h3>
            <p className="text-xs text-slate-400 mt-0.5">Chronological record of processed submissions and cryptographic proofs.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {['ALL', 'REAL', 'FAKE', 'UNVERIFIED'].map((v) => (
              <button
                key={v}
                onClick={() => setFilterVerdict(v)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  filterVerdict === v
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Headline / Subject</th>
                <th className="py-3 px-3">Modality</th>
                <th className="py-3 px-3">Verdict</th>
                <th className="py-3 px-3">Scores (Real vs Fake)</th>
                <th className="py-3 px-3">Confidence</th>
                <th className="py-3 px-3">On-Chain Tx</th>
                <th className="py-3 px-3 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredHistory.map((item) => {
                const isReal = item.verdict === 'REAL';
                const isFake = item.verdict === 'FAKE';
                const badgeStyle = isReal
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : isFake
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30';

                return (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-200 max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono uppercase text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.media_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${badgeStyle}`}>
                        {item.verdict}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono">
                      <span className="text-emerald-400">{item.real_percentage}%</span> / <span className="text-rose-400">{item.fake_percentage}%</span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-cyan-300">
                      {item.confidence}%
                    </td>
                    <td className="py-3.5 px-3">
                      <BlockchainBadge txHash={item.tx_hash} blockNumber={item.block_number} />
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedCert(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-300 transition-colors"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Proof</span>
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
