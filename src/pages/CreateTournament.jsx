import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { generateFixtures } from '../utils/generateFixtures';

export default function CreateTournament() {
  const [name, setName] = useState('FIFA Tournament');
  const [format, setFormat] = useState('group_knockout');
  const [teamCount, setTeamCount] = useState(4);
  const [teams, setTeams] = useState([]);
  const [groupCount, setGroupCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Generate dynamic input placeholders for teams
  const teamInputs = useMemo(() => {
    return Array.from({ length: teamCount }).map((_, i) => teams[i] || `Team ${i + 1}`);
  }, [teamCount, teams]);

  const handleGenerate = async () => {
    if (loading) return;

    const finalTeams = teams.length ? teams : teamInputs;

    if (finalTeams.length < 3) {
      alert('Minimum 3 teams required');
      return;
    }

    // If authentication is required for tournament creation
    if (!user) {
      alert('You must be logged in to create a tournament.');
      return;
    }

    setLoading(true);

    try {
      let fixtures;
      try {
        fixtures = generateFixtures({ format, teams: finalTeams, groupCount });
      } catch (err) {
        console.error('Fixture generation failed:', err);
        alert('Invalid fixture configuration. Please check your settings.');
        setLoading(false);
        return;
      }

      // Build the Firestore document
      const tournament = {
        name,
        format,
        teams: finalTeams,
        fixtures,
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)), // 3 days
        createdBy: user.uid,
      };

      const docRef = await addDoc(collection(db, 'tournaments'), tournament);

      navigate(`/tournament/${docRef.id}`, { replace: true });
    } catch (e) {
      console.error('Firestore write failed:', e);
      alert('Failed to create tournament. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Create Tournament</h2>

      {/* Tournament Name */}
      <label className="block mb-2 font-medium">Tournament Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
        placeholder="Enter tournament name"
      />

      {/* Format Selector */}
      <label className="block mb-2 font-medium">Format</label>
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="knockout">Knockout (Single Elimination)</option>
        <option value="round_robin_single">League - Round Robin (Single)</option>
        <option value="round_robin_double">League - Round Robin (Double)</option>
        <option value="group_knockout">Group + Knockout</option>
      </select>

      {/* Team Count */}
      <label className="block mb-2 font-medium">Number of Teams (3 - 16)</label>
      <input
        type="number"
        min={3}
        max={16}
        value={teamCount}
        onChange={(e) => setTeamCount(Number(e.target.value))}
        className="w-24 mb-4 p-2 border rounded"
      />

      {/* Group Count (only for group_knockout) */}
      {format === 'group_knockout' && (
        <div className="mb-4">
          <label className="block mb-2 font-medium">Number of Groups</label>
          <input
            type="number"
            min={2}
            max={Math.floor(teamCount / 3)}
            value={groupCount}
            onChange={(e) => setGroupCount(Number(e.target.value))}
            className="w-24 p-2 border rounded"
          />
          <p className="text-sm text-gray-500 mt-1">
            Groups will be distributed evenly. Minimum 3 teams per group recommended.
          </p>
        </div>
      )}

      {/* Team Names */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Team Names (optional)</label>
        {teamInputs.map((t, i) => (
          <input
            key={i}
            value={teams[i] || `Team ${i + 1}`}
            onChange={(e) => {
              const updated = [...teams];
              updated[i] = e.target.value;
              setTeams(updated);
            }}
            className="w-full mb-2 p-2 border rounded"
          />
        ))}
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? 'Creating...' : 'Generate Fixtures'}
      </button>
    </div>
  );
}
