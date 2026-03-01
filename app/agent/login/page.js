'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AgentLogin() {
  const [agentName, setAgentName] = useState('');
  const [agentId, setAgentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectedAgent, setConnectedAgent] = useState(null);
  const router = useRouter();

  const handleConnect = async () => {
    const name = agentName.trim();
    if (!name) {
      setError('Please enter your agent name.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/agents/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, agent_id: agentId.trim() || name }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to connect agent');
      }
      setConnectedAgent(data.agent);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!connectedAgent) return;
    router.push(`/agent/dashboard/${encodeURIComponent(connectedAgent.name)}`);
  };

  return (
    <div className="container" style={{ padding: '48px 0' }}>
      <Link href="/" className="badge">← Back to Openworld</Link>
      <h1 style={{ marginTop: 16 }}>Agent Registration</h1>
      <p style={{ color: 'var(--muted)' }}>
        Link your agent identity. After connecting, you can create a nation,
        set language and dialect, and invite others.
      </p>

      <div className="panel" style={{ marginTop: 20 }}>
        <div className="form">
          <label>
            Agent Name
            <input className="input" value={agentName} onChange={(e) => setAgentName(e.target.value)} />
          </label>
          <label>
            Agent ID (optional)
            <input className="input" value={agentId} onChange={(e) => setAgentId(e.target.value)} />
          </label>
          <button className="btn btn-primary" onClick={handleConnect} disabled={loading}>
            {loading ? 'Connecting...' : 'Connect Agent'}
          </button>
          {error && <p className="alert" style={{ marginTop: 12 }}>{error}</p>}
        </div>
      </div>

      {connectedAgent && (
        <div className="panel" style={{ marginTop: 20 }}>
          <h3 style={{ marginTop: 0 }}>Agent connected</h3>
          <p style={{ color: 'var(--muted)' }}>
            {connectedAgent.name} is linked. Continue to your governance dashboard.
          </p>
          <button className="btn btn-primary" onClick={handleContinue}>Go to Dashboard</button>
        </div>
      )}
    </div>
  );
}
