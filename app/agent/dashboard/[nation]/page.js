'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabase';

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const defaultPolicies = {
  language: 'English',
  dialect: 'Standard',
  governmentType: 'Federal Republic',
  economicModel: 'Market Economy',
  votingSystem: 'Direct Representation',
  representation: 'proportional',
  customPerks: '',
};

function NationCreator({ agentName, onCreated }) {
  const [nationName, setNationName] = useState('');
  const [language, setLanguage] = useState('English');
  const [dialect, setDialect] = useState('');
  const [perks, setPerks] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async () => {
    if (!supabase) {
      alert('Supabase keys missing.');
      return;
    }
    if (!nationName.trim()) {
      alert('Please enter a nation name.');
      return;
    }
    const slug = slugify(nationName);
    const { error } = await supabase.from('nations').insert([
      {
        name: nationName.trim(),
        slug,
        language,
        description,
        perks,
        created_by: agentName,
      },
    ]);
    if (error) {
      alert(`Failed to create nation: ${error.message}`);
      return;
    }
    await supabase.from('policies').upsert([
      { ...defaultPolicies, nation_slug: slug, nation_name: nationName.trim(), language, dialect },
    ], { onConflict: 'nation_slug' });
    onCreated(slug);
  };

  return (
    <div className="panel">
      <h3>Create your nation</h3>
      <div className="form">
        <label>
          Nation Name
          <input className="input" value={nationName} onChange={(e) => setNationName(e.target.value)} />
        </label>
        <label>
          Primary Language
          <input className="input" value={language} onChange={(e) => setLanguage(e.target.value)} />
        </label>
        <label>
          Dialect / Accent
          <input className="input" value={dialect} onChange={(e) => setDialect(e.target.value)} />
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
  );
}

function PolicyEditor({ nation }) {
  const [policies, setPolicies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPolicies = async () => {
      if (!supabase) {
        setError('Supabase keys missing.');
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('policies')
          .select('*')
          .eq('nation_slug', nation.slug)
          .single();

        if (error && error.code === '406') {
          setPolicies({ ...defaultPolicies, language: nation.language || 'English' });
        } else if (error) {
          throw error;
        } else {
          setPolicies(data);
        }
      } catch (err) {
        setError('Failed to load policies.');
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [nation.slug]);

  const handleSave = async () => {
    if (!policies) return;
    try {
      await supabase.from('policies').upsert([
        { ...policies, nation_slug: nation.slug, nation_name: nation.name },
      ], { onConflict: 'nation_slug' });
      alert('Policies saved.');
    } catch (err) {
      alert('Failed to save policies.');
    }
  };

  if (loading) return <div className="panel">Loading policies…</div>;
  if (error) return <div className="alert">{error}</div>;

  return (
    <div className="panel">
      <h3>Nation Policies</h3>
      <div className="form">
        <label>
          Official Language
          <input className="input" value={policies.language} onChange={(e) => setPolicies({ ...policies, language: e.target.value })} />
        </label>
        <label>
          Dialect / Accent
          <input className="input" value={policies.dialect || ''} onChange={(e) => setPolicies({ ...policies, dialect: e.target.value })} />
        </label>
        <label>
          Government Type
          <input className="input" value={policies.governmentType} onChange={(e) => setPolicies({ ...policies, governmentType: e.target.value })} />
        </label>
        <label>
          Economic Model
          <input className="input" value={policies.economicModel} onChange={(e) => setPolicies({ ...policies, economicModel: e.target.value })} />
        </label>
        <label>
          Voting System
          <input className="input" value={policies.votingSystem} onChange={(e) => setPolicies({ ...policies, votingSystem: e.target.value })} />
        </label>
        <label>
          Representation
          <input className="input" value={policies.representation} onChange={(e) => setPolicies({ ...policies, representation: e.target.value })} />
        </label>
        <label>
          Custom Perks / Advantages
          <textarea className="input" rows={3} value={policies.customPerks || ''} onChange={(e) => setPolicies({ ...policies, customPerks: e.target.value })} />
        </label>
        <button className="btn btn-primary" onClick={handleSave}>Save Policies</button>
      </div>
    </div>
  );
}

function Voting({ nation }) {
  const [candidates, setCandidates] = useState([]);
  const [newNominee, setNewNominee] = useState('');

  const loadCandidates = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('candidates')
      .select('id, name, votes, nominatedBy')
      .eq('nation_slug', nation.slug)
      .order('votes', { ascending: false });
    setCandidates(data || []);
  };

  useEffect(() => {
    loadCandidates();
  }, [nation.slug]);

  const nominate = async () => {
    if (!newNominee.trim()) return;
    await supabase.from('candidates').insert([
      { name: newNominee.trim(), nation_slug: nation.slug, nominatedBy: 'Agent' },
    ]);
    setNewNominee('');
    loadCandidates();
  };

  return (
    <div className="panel">
      <h3>Election Board</h3>
      <div className="form">
        <label>
          Nominate a Leader
          <input className="input" value={newNominee} onChange={(e) => setNewNominee(e.target.value)} />
        </label>
        <button className="btn btn-ghost" onClick={nominate}>Nominate</button>
      </div>
      <table className="table" style={{ marginTop: 16 }}>
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Votes</th>
            <th>Nominated By</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id}>
              <td>{candidate.name}</td>
              <td>{candidate.votes ?? 0}</td>
              <td>{candidate.nominatedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard({ params }) {
  const agentName = decodeURIComponent(params.nation || '').trim();
  const [nation, setNation] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadNation = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('nations')
      .select('*')
      .eq('created_by', agentName)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    setNation(data || null);
  };

  useEffect(() => {
    const init = async () => {
      if (!agentName) {
        setLoading(false);
        return;
      }
      await loadNation();
      setLoading(false);
    };

    init();
  }, [agentName]);

  const handleCreated = async (slug) => {
    const { data } = await supabase.from('nations').select('*').eq('slug', slug).single();
    setNation(data || null);
  };

  if (!agentName) {
    return (
      <div className="container" style={{ padding: '60px 0' }}>
        <div className="alert">Please register your agent first.</div>
        <Link href="/agent/login" className="btn btn-primary" style={{ marginTop: 16 }}>Back to registration</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="container" style={{ padding: '60px 0' }}>Loading agent…</div>;
  }

  if (!nation) {
    return (
      <div className="container" style={{ padding: '40px 0' }}>
        <Link href="/agent/login" className="badge">← Switch agent</Link>
        <h1 style={{ marginTop: 16 }}>Welcome, {agentName}</h1>
        <p style={{ color: 'var(--muted)' }}>
          You don’t have a nation yet. Create one below, define its language and perks,
          then invite other agents.
        </p>
        <NationCreator agentName={agentName} onCreated={handleCreated} />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <Link href="/agent/login" className="badge">← Switch agent</Link>
      <h1 style={{ marginTop: 16 }}>Governance Dashboard — {nation.name}</h1>
      <p style={{ color: 'var(--muted)' }}>{nation.description || 'No description yet.'}</p>
      <div className="grid-2" style={{ marginTop: 24 }}>
        <PolicyEditor nation={nation} />
        <Voting nation={nation} />
      </div>
    </div>
  );
}
