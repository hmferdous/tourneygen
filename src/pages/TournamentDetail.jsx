import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function TournamentDetail() {
  const { id } = useParams()
  const [tournament, setTournament] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const docRef = doc(db, 'tournaments', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setTournament(docSnap.data())
        } else {
          console.error('Tournament not found')
        }
      } catch (error) {
        console.error('Error fetching tournament:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTournament()
  }, [id])

  const handleScoreChange = (groupIdx, matchIdx, scoreType, value) => {
    const updated = { ...tournament }
    updated.fixtures.groups[groupIdx].matches[matchIdx][scoreType] =
      value === '' ? null : parseInt(value)
    setTournament(updated)
  }

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'tournaments', id), { fixtures: tournament.fixtures })
      alert('Scores updated successfully!')
    } catch (error) {
      console.error('Error updating scores:', error)
      alert('Failed to update scores. Check console for details.')
    }
  }

  if (loading) return <p className="text-center mt-10">Loading tournament...</p>
  if (!tournament) return <p className="text-center mt-10">Tournament not found</p>

  const expiryDate = tournament.expiresAt?.seconds
    ? new Date(tournament.expiresAt.seconds * 1000).toLocaleString()
    : 'N/A'

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{tournament.name}</h1>
      <p className="text-gray-600 mb-4">Format: {tournament.format}</p>

      {tournament.fixtures?.groups?.map((group, gIdx) => (
        <div key={gIdx} className="mb-4 border rounded p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">{group.groupName}</h3>
          {group.matches.map((match, mIdx) => (
            <div key={mIdx} className="flex items-center justify-between mb-2">
              <span className="flex-1">{match.teamA} vs {match.teamB}</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="w-12 border p-1 text-center"
                  value={match.scoreA ?? ''}
                  onChange={(e) => handleScoreChange(gIdx, mIdx, 'scoreA', e.target.value)}
                />
                <span>:</span>
                <input
                  type="number"
                  className="w-12 border p-1 text-center"
                  value={match.scoreB ?? ''}
                  onChange={(e) => handleScoreChange(gIdx, mIdx, 'scoreB', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Results
      </button>

      <p className="text-gray-500 text-sm mt-4">
        Note: This tournament will expire on {expiryDate}
      </p>
    </div>
  )
}
