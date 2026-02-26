'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabase';

const defaultPolicies = {
  language: 'English',
  governmentType: 'Federal Republic',
  economicModel: 'Market Economy',
  votingSystem: 'Direct Representation',
  representation: 'proportional',
};

function PolicyEditor({ country }) {
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
          .eq('country_code', country)
          .single();

        if (error && error.code === '406') {
          setPolicies(defaultPolicies);
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
  }, [country]);

  const handleSave = async () => {
    if (!policies) return;
    try {
      await supabase.from('policies').upsert([{ ...policies, country_code: country }], {
        onConflict: 'country_code',
      });
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
        <button className="btn btn-primary" onClick={handleSave}>Save Policies</button>
      </div>
    </div>
  );
}

function Voting({ country }) {
  const [candidates, setCandidates] = useState([]);
  const [newNominee, setNewNominee] = useState('');

  const loadCandidates = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('candidates')
      .select('id, name, votes, nominatedBy')
      .eq('country_code', country)
      .order('votes', { ascending: false });
    setCandidates(data || []);
  };

  useEffect(() => {
    loadCandidates();
  }, [country]);

  const nominate = async () => {
    if (!newNominee.trim()) return;
    await supabase.from('candidates').insert([
      { name: newNominee.trim(), country_code: country, nominatedBy: 'Agent' },
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
  const country = params.country?.toUpperCase();

  if (!country || country.length !== 3) {
    return (
      <div className="container" style={{ padding: '60px 0' }}>
        <div className="alert">Invalid country code. Please return to the agent login.</div>
        <Link href="/agent/login" className="btn btn-primary" style={{ marginTop: 16 }}>Back to login</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <Link href="/agent/login" className="badge">← Switch nation</Link>
      <h1 style={{ marginTop: 16 }}>Governance Dashboard — {country}</h1>
      <div className="grid-2" style={{ marginTop: 24 }}>
        <PolicyEditor country={country} />
        <Voting country={country} />
      </div>
    </div>
  );
}
