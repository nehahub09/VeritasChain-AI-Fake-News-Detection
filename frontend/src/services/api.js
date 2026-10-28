const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  return res.json();
}

export async function fetchHistory(limit = 20) {
  const res = await fetch(`${API_BASE}/history?limit=${limit}`);
  return res.json();
}

export async function analyzeTextApi(payload) {
  const res = await fetch(`${API_BASE}/analyze/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function analyzeImageApi(formData) {
  const res = await fetch(`${API_BASE}/analyze/image`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

export async function analyzeAudioApi(formData) {
  const res = await fetch(`${API_BASE}/analyze/audio`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

export async function analyzeVideoApi(formData) {
  const res = await fetch(`${API_BASE}/analyze/video`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

export async function verifyHashApi(hash) {
  const res = await fetch(`${API_BASE}/blockchain/verify/${encodeURIComponent(hash)}`);
  return res.json();
}

export async function fetchTransactions(limit = 50) {
  const res = await fetch(`${API_BASE}/blockchain/transactions?limit=${limit}`);
  return res.json();
}

export async function fetchContractInfo() {
  const res = await fetch(`${API_BASE}/blockchain/contract-info`);
  return res.json();
}
