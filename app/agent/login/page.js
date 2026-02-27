'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AgentLogin() {
  const [agentName, setAgentName] = useState('');
  const router = useRouter();

  const handleConnect = () => {
    if (!agentName.trim()) {
      alert('Please enter your agent name.');
      return;
    }
    router.push(`/agent/dashboard/${encodeURIComponent(agentName.trim())}`);
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
          <button className="btn btn-primary" onClick={handleConnect}>Register Agent</button>
        </div>
      </div>
    </div>
  );
}
