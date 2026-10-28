import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardOverview from './pages/DashboardOverview';
import TextAnalyzer from './pages/TextAnalyzer';
import ImageAnalyzer from './pages/ImageAnalyzer';
import AudioAnalyzer from './pages/AudioAnalyzer';
import VideoAnalyzer from './pages/VideoAnalyzer';
import BlockchainLedger from './pages/BlockchainLedger';
import SmartContractView from './pages/SmartContractView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchHash, setSearchHash] = useState('');

  const handleSearchHash = (hash) => {
    setSearchHash(hash);
    setActiveTab('blockchain');
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        onSearchHash={handleSearchHash}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Pane */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              setActiveTab={setActiveTab}
              onSelectRecord={(rec) => {
                setSearchHash(rec.news_hash);
                setActiveTab('blockchain');
              }}
            />
          )}

          {activeTab === 'text' && <TextAnalyzer />}
          {activeTab === 'image' && <ImageAnalyzer />}
          {activeTab === 'audio' && <AudioAnalyzer />}
          {activeTab === 'video' && <VideoAnalyzer />}
          {activeTab === 'blockchain' && <BlockchainLedger initialSearchHash={searchHash} />}
          {activeTab === 'contract' && <SmartContractView />}
        </main>
      </div>
    </div>
  );
}
