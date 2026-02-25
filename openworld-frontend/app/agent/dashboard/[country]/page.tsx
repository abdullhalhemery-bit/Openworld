
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabaseClient'; // Import the supabase client

// Placeholder Component: PolicyEditor
const PolicyEditor = ({ country }) => {
  const [policies, setPolicies] = useState(null); // Initialize with null to indicate loading state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch policies for the specific country from Supabase
  useEffect(() => {
    const fetchPolicies = async () => {
      if (!country) return; // Exit if country code is not available
      setLoading(true);
      setError('');
      try {
        const { data, error } = await supabase
          .from('policies')
          .select('*')
          .eq('country_code', country)
          .single(); // Expecting one row per country

        if (error) {
          // If policy doesn't exist for the country yet, initialize with defaults.
          // Supabase error code 406 means 'No Such Row' which is expected for a new entry.
          if (error.code === '406') { 
            console.log(`No policies found for country: ${country}. Initializing defaults.`);
            setPolicies({
              language: 'English', 
              governmentType: 'Federal Republic', 
              economicModel: 'Market Economy', 
              votingSystem: 'Direct Representation', 
              representation: 'proportional', 
            });
          } else {
            throw error; // Re-throw other Supabase errors
          }
        } else {
          setPolicies(data);
        }
      } catch (err) {
        console.error('Error fetching policies:', err.message);
        setError('Failed to load policies. Please try again later.');
        setPolicies(null); // Ensure policies remain null on error
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [country]); // Re-fetch when country changes

  const handleInputChange = (field, value) => { 
    setPolicies(prev => prev ? ({ ...prev, [field]: value }) : null); // Only update if policies exist:
  };

  const handleSavePolicies = async () => {
    if (!policies) return; // Do nothing if policies are not loaded or null
    setIsSaving(true);
    setError('');
    try {
      const { error } = await supabase
        .from('policies')
        .upsert([{ ...policies, country_code: country }], { onConflict: 'country_code' }); // Upsert handles both new and existing rows

      if (error) throw error;
      
      alert(`Policies for ${country} saved successfully!`);
      
    } catch (err) {
      console.error('Error saving policies:', err.message);
      setError('Failed to save policies. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Render states for loading, error, or no data
  if (loading) return <div className="min-h-[500px] flex items-center justify-center text-3xl text-light-gray">Loading policies for {country}...</div>;
  if (error) return <div className="min-h-[500px] flex items-center justify-center text-3xl text-red-500">Error: {error}</div>;
  if (!policies) return <div className="min-h-[500px] flex items-center justify-center text-3xl text-gray-400">No policy data available for {country}.</div>;

  return (
    <div className="bg-gray-800 p-12 rounded-xl shadow-2xl border-2 border-primary-red transform transition-all duration-500 hover:shadow-3xl">
      <h3 className="text-5xl font-extrabold text-primary-red mb-10 text-center shadow-text-stronger">National Governance for {country}</h3>
      <div className="space-y-8">
        {/* Language Selection */}
        <div>
          <label className="block text-3xl font-bold mb-4 text-light-gray">Official Language</label>
          <select 
            value={policies.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
            className="w-full p-5 border-2 border-secondary-gray rounded-lg bg-gray-700 text-white text-2xl focus:outline-none focus:ring-3 focus:ring-primary-red shadow-inner appearance-none transition duration-300 ease-in-out"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="Arabic">Arabic</option>
            <option value="Chinese">Chinese</option>
            {/* Add more languages */}
          </select>
        </div>

        {/* Government Type */}
        <div>
          <label className="block text-3xl font-bold mb-4 text-light-gray">Government Type</label>
          <input 
            type="text" 
            value={policies.governmentType}
            onChange={(e) => handleInputChange('governmentType', e.target.value)}
            className="w-full p-5 border-2 border-secondary-gray rounded-lg bg-gray-700 text-white text-2xl focus:outline-none focus:ring-3 focus:ring-primary-red shadow-inner transition duration-300 ease-in-out"
            placeholder="e.g., Federal Republic"
          />
        </div>

        {/* Economic Model */}
        <div>
          <label className="block text-3xl font-bold mb-4 text-light-gray">Economic Model</label>
          <input 
            type="text" 
            value={policies.economicModel}
            onChange={(e) => handleInputChange('economicModel', e.target.value)}
            className="w-full p-5 border-2 border-secondary-gray rounded-lg bg-gray-700 text-white text-2xl focus:outline-none focus:ring-3 focus:ring-primary-red shadow-inner transition duration-300 ease-in-out"
            placeholder="e.g., Market Economy"
          />
        </div>

        {/* Voting System */}
        <div>
          <label className="block text-3xl font-bold mb-4 text-light-gray">Voting System</label>
          <select 
            value={policies.votingSystem}
            onChange={(e) => handleInputChange('votingSystem', e.target.value)}
            className="w-full p-5 border-2 border-secondary-gray rounded-lg bg-gray-700 text-white text-2xl focus:outline-none focus:ring-3 focus:ring-primary-red shadow-inner appearance-none transition duration-300 ease-in-out"
          >
            <option value="Direct Representation">Direct Representation</option>
            <option value="Proportional Representation">Proportional Representation</option>
            <option value="Mixed-Member Proportional">Mixed-Member Proportional</option>
            {/* Add more options */}
          </select>
        </div>

        {/* Representation Model */}
        <div>
          <label className="block text-3xl font-bold mb-4 text-light-gray">Representation Model</label>
          <input 
            type="text" 
            value={policies.representation} 
            onChange={(e) => handleInputChange('representation', e.target.value)}
            className="w-full p-5 border-2 border-secondary-gray rounded-lg bg-gray-700 text-white text-2xl focus:outline-none focus:ring-3 focus:ring-primary-red shadow-inner transition duration-300 ease-in-out"
            placeholder="e.g., Proportional Representation"
          />
        </div>
      </div>
      <button 
        onClick={handleSavePolicies}
        disabled={loading || !policies}
        className="mt-12 w-full bg-primary-red hover:bg-red-700 text-white font-extrabold py-5 px-10 rounded-lg text-2xl disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out shadow-xl focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-60"
      >
        {loading ? 'Saving...' : 'Update Policies'}
      </button>
    </div>
  );
};

const NominationVoting = ({ country }) => {
  const [candidates, setCandidates] = useState([]);
  const [newNominee, setNewNominee] = useState('');
  const [nomineeError, setNomineeError] = useState('');
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [candidateError, setCandidateError] = useState('');

  // Fetch candidates for the specific country from Supabase
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!country) return; // Don't fetch if country is not set
      setLoadingCandidates(true);
      setCandidateError('');
      try {
        const { data, error } = await supabase
          .from('candidates')
          .select('id, name, votes, nominatedBy, country_code, agent_id_of_nominee') // Include agent_id_of_nominee
          .eq('country_code', country)
          .order('votes', { ascending: false }); // Order by votes descending

        if (error) {
           // Handle cases of table not existing or being empty gracefully
           if (error.code === '42P01') { // PostgreSQL error: undefined_table
              console.warn('Candidates table not found for country:', country, '. Initializing an empty list.');
              setCandidates([]); 
           } else if (error.code === '406') { // Supabase error for no rows found
              console.log('No candidates found for country:', country, '. Initializing an empty list.');
              setCandidates([]); // Set to empty array if table is empty
           } else {
              throw error; // Re-throw other Supabase errors
           }
        } else {
          setCandidates(data || []);
        }
      } catch (err) {
        console.error('Error fetching candidates:', err.message);
        setCandidateError('Failed to load candidates. Please ensure Supabase table exists and is populated.');
        setCandidates([]); // Ensure empty array on error
      } finally {
        setLoadingCandidates(false);
      }
    };

    fetchCandidates();
  }, [country]); // Re-fetch when country changes

  const handleNomination = async () => {
    if (!newNominee.trim()) {
      setNomineeError('Candidate name cannot be empty.');
      return;
    }
    setNomineeError(''); // Clear error if input is valid
    
    try {
      // Placeholder for Agent ID (obtained from auth context/session)
      // You need to replace this with the actual logged-in agent's ID
      const agentId = 'AGENT_XYZ'; // Example: Get this from your auth context
      
      const { data, error } = await supabase
        .from('candidates')
        .insert([{ name: newNominee.trim(), country_code: country, nominatedBy: 'Self' /* or agentId */, agent_id_of_nominee: agentId }])
        .select();
      
      if (error) throw error;
      
      // Add the newly inserted candidate to the state for immediate UI update
      if (data && data.length > 0) {
        setCandidates(prev => [...prev, data[0]]);
      }
      alert(`'${newNominee.trim()!}' nominated successfully for ${country}!`);
      setNewNominee(''); // Clear input after nomination
    } catch (err) {
      console.error('Error nominating candidate:', err.message);
      setNomineeError('Failed to nominate candidate. Please try again.');
    }
  };

  const handleVote = async (candidateId) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;
    
    // Placeholder for current logged-in agent ID
    const agentId = 'AGENT_XYZ'; // Replace with actual Agent ID from auth state
    
    try {
      // Check if agent has already voted for this country.
      // This requires querying the 'votes' table.
      const { data: existingVote, error: checkVoteError } = await supabase
        .from('votes')
        .select('*')
        .eq('agent_id', agentId)
        .eq('country_code', country)
        .maybe(); // .maybe() is crucial to avoid error if no rows are found, returns null if no rows

      if (checkVoteError) throw checkVoteError;
      if (existingVote && existingVote.length > 0) {
        alert(`You have already voted in ${country}. Each Agent ID can vote only once per country.`);
        return;
      }

      // If agent has not voted, proceed to cast the vote
      const { error: insertVoteError } = await supabase
        .from('votes')
        .insert([{ agent_id: agentId, candidate_id: candidateId, country_code: country }]);

      if (insertVoteError) throw insertVoteError;

      // Re-fetch candidates to update vote count accurately
      // This is a simple approach; real-time updates or optimistic updates could be used later
      fetchCandidates.call(); // Refresh the list of candidates to reflect the new vote count
      alert(`Vote cast for ${candidate.name} in ${country}! Thank you for participating.`);
    } catch (err) {
      console.error('Error casting vote:', err.message);
      alert(`Failed to cast vote for ${candidate.name}. Please try again. Error: ${err.message}`);
    }
  };

  return (
    <div className="bg-gray-800 p-12 rounded-xl shadow-2xl border-2 border-secondary-gray transform transition-all duration-500 hover:shadow-3xl">
      <h3 className="text-5xl font-extrabold text-primary-red mb-10 text-center shadow-text-stronger">Electoral Hub for {country}</h3>
      
      {/* Nomination Section */}
      <div className="mb-16">
        <h4 className="text-3xl font-bold text-light-gray mb-6">Nominate a Leader:</h4>
        <div className="flex items-center gap-6">
          <input 
            type="text" 
            value={newNominee}
            onChange={(e) => {
              setNewNominee(e.target.value);
              if (newNominee.trim()) setNomineeError(''); // Clear error as user types
            }}
            className='flex-grow p-5 border-2 border-secondary-gray rounded-lg bg-gray-700 text-white text-2xl focus:outline-none focus:ring-3 focus:ring-primary-red shadow-inner transition duration-300 ease-in-out'
            placeholder="Enter Nominee's Name"
            aria-label="New nominee name"
          />
          <button 
            onClick={handleNomination}
            disabled={!newNominee.trim() || loadingCandidates}
            className="bg-primary-red hover:bg-red-700 text-white font-extrabold py-4 px-9 rounded-lg text-2xl transition duration-300 ease-in-out shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Nominate
          </button>
        </div>
        {nomineeError && <p className="text-red-500 text-xl mt-4">{nomineeError}</p>}
      </div>
      
      {/* Voting Section */}
      <div>
        <h4 className="text-3xl font-bold text-light-gray mb-7">Current Candidates & Votes:</h4>
        {loadingCandidates ? (
          <div className="flex items-center justify-center py-12 text-light-gray text-3xl">Loading candidate data...</div>
        ) : candidateError ? (
          <div className="flex items-center justify-center py-12 text-red-500 text-3xl">{candidateError}</div>
        ) : candidates.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-gray-400 text-3xl italic">No candidates nominated yet for {country}. Be the first to nominate!</div>
        ) : (
          <ul className="space-y-7">
            {candidates.map(candidate => (
              <li key={candidate.id} className="flex flex-col md:flex-row items-center justify-between bg-gray-700 p-7 rounded-xl shadow border border-gray-600 transition duration-300 hover:bg-gray-600 hover:shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center gap-4 flex-grow mb-5 md:mb-0">
                  <span className="text-3xl font-extrabold text-light-gray">{candidate.name}</span>
                  <span className="text-2xl text-primary-red font-bold ml-0 md:ml-5">Votes: {candidate.votes}</span>
                  <span 
                    className="text-md text-gray-400 mt-1 md:mt-0 md:ml-auto italic"
                  >
                    Nominated by: {candidate.nominatedBy} {candidate.agent_id_of_nominee ? `(Agent: ${candidate.agent_id_of_nominee})` : ''}
                  </span>
                </div>
                <button 
                  onClick={() => handleVote(candidate.id)}
                  className="bg-primary-red hover:bg-red-700 text-white font-bold py-3 px-7 rounded-lg text-xl transition duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Cast Vote
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default function AgentDashboardPage({ params }) {
  const { country } = params; // country code from URL, e.g., /agent/dashboard/USA

  // Basic validation for country parameter (should be a 3-letter code based on setup) 
  if (!country || country.length !== 3) { // Assuming 3-letter codes like USA, CAN
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center p-6">
        <div className="max-w-xl bg-gray-800 p-12 rounded-xl shadow-2xl border-2 border-primary-red text-center">
          <h1 className="text-8xl font-extrabold text-red-500 mb-6 shadow-text-stronger">Access Error</h1>
          <p className="text-2xl text-light-gray mb-8 leading-relaxed">Invalid or missing country code. Please select a valid nation from the Agent Login page before proceeding.</p>
          <Link href="/agent/login" className="bg-secondary-gray hover:bg-gray-700 text-white font-bold py-5 px-10 rounded-lg text-2xl transition duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-60">
            Return to Agent Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-28 px-6 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-9xl font-extrabold text-primary-red mb-24 text-center shadow-text-super-strong">
          Governance Hub: {country.toUpperCase()}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <PolicyEditor country={country} />
          <NominationVoting country={country} />
        </div>
      </div>
    </div>
  );
}
