import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { generateFixtures } from '../utils/generateFixtures'
import { useAuth } from '../context/AuthContext'

export default function CreateTournament() {
  const [name, setName] = useState('FIFA Tournament')
  const [format, setFormat] = useState('group_knockout')
  const [teamCount, setTeamCount] = useState(4)
  const [teams, setTeams] = useState([])
  const [groupCount, setGroupCount] = useState(2)
  const { user } = useAuth()
  const navigate = useNavigate()

  const createTeamInputs = () => Array.from({ length: teamCount }).map((_, i) => teams[i] || `Team ${i + 1}`)

  const handleGenerate = async () => {
    const finalTeams = teams.length ? teams : createTeamInputs()
    if (finalTeams.length < 3) return alert('Minimum 3 teams required')

    const fixtures = generateFixtures({ format, teams: finalTeams, groupCount })

    const tournament = {
      name,
      format,
      teams: finalTeams,
      fixtures,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days expiry
      createdBy: user ? user.uid : 'guest',
    }

    try {
      const docRef = await addDoc(collection(db, 'tournaments'), tournament)
      navigate(`/tournament/${docRef.id}`)
    } catch (e) {
      console.error('Error creating tournament:', e)
      alert('Failed to create tournament. Check console for details.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Create Tournament</h2>

      <label className="block mb-2">Tournament Name</label>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      <label className="block mb-2">Format</label>
      <select
        value={format}
        onChange={e => setFormat(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="knockout">Knockout (Single Elimination)</option>
        <option value="round_robin_single">League - Round Robin (Single)</option>
        <option value="round_robin_double">League - Round Robin (Double)</option>
        <option value="group_knockout">Group + Knockout</option>
      </select>

      <label className="block mb-2">Number of Teams (3 - 16)</label>
      <input
        type="number"
        min={3}
        max={16}
        value={teamCount}
        onChange={e => setTeamCount(Number(e.target.value))}
        className="w-24 mb-4 p-2 border rounded"
      />

      {format === 'group_knockout' && (
        <div className="mb-4">
          <label>Number of Groups</label>
          <input
            type="number"
            min={2}
            max={Math.floor(teamCount / 3)}
            value={groupCount}
            onChange={e => setGroupCount(Number(e.target.value))}
            className="w-24 p-2 border rounded"
          />
          <p className="text-sm text-gray-500">
            Groups will be distributed evenly. Minimum 3 teams per group recommended.
          </p>
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2">Team Names (optional)</label>
        {createTeamInputs().map((t, i) => (
          <input
            key={i}
            defaultValue={t}
            onChange={e => {
              const copy = [...teams]
              copy[i] = e.target.value
              setTeams(copy)
            }}
            className="w-full mb-2 p-2 border rounded"
          />
        ))}
      </div>

      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Generate Fixtures
      </button>
    </div>
  )
}
