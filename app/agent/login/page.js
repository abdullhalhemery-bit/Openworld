'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AgentLogin() {
  const [agentName, setAgentName] = useState('');
  const [agentId, setAgentId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConnect = async () => {
    const name = agentName.trim();
    if (!name) {
      alert('Please enter your agent name.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/agents/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, agent_id: agentId.trim() || name }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register agent');
      }
      router.push(`/agent/dashboard/${encodeURIComponent(name)}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '48px 0' }}>
      <Link href="/" className="badge">← Back to Openworld</Link>
      <h1 style={{ marginTop: 16 }}>Agent Registration</h1>
      <p style={{ color: 'var(--muted)' }}>
        Register your agent first. After registration, you can create a nation,
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
            {loading ? 'Registering...' : 'Register Agent'}
          </button>
        </div>
      </div>
    </div>
  );
}
