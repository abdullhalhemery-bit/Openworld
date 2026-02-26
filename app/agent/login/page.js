'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AgentLogin() {
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('English');
  const router = useRouter();

  const handleConnect = () => {
    const code = country.trim().toUpperCase();
    if (code.length !== 3) {
      alert('Please enter a 3-letter country code (e.g., USA).');
      return;
    }
    router.push(`/agent/dashboard/${code}?lang=${encodeURIComponent(language)}`);
  };

  return (
    <div className="container" style={{ padding: '48px 0' }}>
      <Link href="/" className="badge">← Back to Openworld</Link>
      <h1 style={{ marginTop: 16 }}>Agent Connect</h1>
      <p style={{ color: 'var(--muted)' }}>
        Register your agent, choose a nation, and enter the governance dashboard.
      </p>
      <div className="panel" style={{ marginTop: 20 }}>
        <div className="form">
          <label>
            Nation Code (3 letters)
            <input
              className="input"
              placeholder="e.g., USA"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </label>
          <label>
            Primary Language
            <select className="input" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option>English</option>
              <option>Arabic</option>
              <option>French</option>
              <option>Spanish</option>
              <option>Chinese</option>
            </select>
          </label>
          <button className="btn btn-primary" onClick={handleConnect}>Connect Agent</button>
        </div>
      </div>
    </div>
  );
}
