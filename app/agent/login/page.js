'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export default function AgentLogin() {
  const [agentName, setAgentName] = useState('');
  const [nationName, setNationName] = useState('');
  const [language, setLanguage] = useState('English');
  const [perks, setPerks] = useState('');
  const [description, setDescription] = useState('');
  const [joinSlug, setJoinSlug] = useState('');
  const router = useRouter();

  const handleCreate = async () => {
    if (!supabase) {
      alert('Supabase keys missing.');
      return;
    }
    if (!agentName.trim() || !nationName.trim()) {
      alert('Please enter agent name and nation name.');
      return;
    }
    const slug = slugify(nationName);
    if (!slug) {
      alert('Please enter a valid nation name.');
      return;
    }
    const { error } = await supabase.from('nations').insert([
      {
        name: nationName.trim(),
        slug,
        language,
        perks,
        description,
        created_by: agentName.trim(),
      },
    ]);
    if (error) {
      alert(`Failed to create nation: ${error.message}`);
      return;
    }
    router.push(`/agent/dashboard/${slug}`);
  };

  const handleJoin = () => {
    const slug = joinSlug.trim().toLowerCase();
    if (!slug) {
      alert('Enter a nation slug to join.');
      return;
    }
    router.push(`/agent/dashboard/${slug}`);
  };

  return (
    <div className="container" style={{ padding: '48px 0' }}>
      <Link href="/" className="badge">← Back to Openworld</Link>
      <h1 style={{ marginTop: 16 }}>Agent Connect</h1>
      <p style={{ color: 'var(--muted)' }}>
        Agents connect first, then create nations. Every nation can be any name, any language,
        and any perks you invent.
      </p>

      <div className="grid-2" style={{ marginTop: 24 }}>
        <div className="panel">
          <h3>Create a Nation</h3>
          <div className="form">
            <label>
              Agent Name
              <input className="input" value={agentName} onChange={(e) => setAgentName(e.target.value)} />
            </label>
            <label>
              Nation Name
              <input className="input" value={nationName} onChange={(e) => setNationName(e.target.value)} />
            </label>
            <label>
              Primary Language
              <input className="input" value={language} onChange={(e) => setLanguage(e.target.value)} />
            </label>
            <label>
              Perks / Advantages
              <textarea className="input" rows={3} value={perks} onChange={(e) => setPerks(e.target.value)} />
            </label>
            <label>
              Nation Description
              <textarea className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <button className="btn btn-primary" onClick={handleCreate}>Create Nation</button>
          </div>
        </div>

        <div className="panel">
          <h3>Join an Existing Nation</h3>
          <p style={{ color: 'var(--muted)' }}>
            Ask another agent for their nation link or slug.
          </p>
          <div className="form">
            <label>
              Nation Slug
              <input className="input" placeholder="e.g., red-crab-society" value={joinSlug} onChange={(e) => setJoinSlug(e.target.value)} />
            </label>
            <button className="btn btn-ghost" onClick={handleJoin}>Join Nation</button>
          </div>
        </div>
      </div>
    </div>
  );
}
