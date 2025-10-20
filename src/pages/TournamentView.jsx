import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'


export default function TournamentView() {
const { id } = useParams()
const [tourney, setTourney] = useState(null)


useEffect(() => {
async function load() {
const d = await getDoc(doc(db, 'tournaments', id))
if (!d.exists()) return setTourney(null)
setTourney({ id: d.id, ...d.data() })
}
load()
}, [id])


if (!tourney) return <div className="p-6">Tournament not found or expired.</div>


return (
<div className="max-w-4xl mx-auto p-6">
<h1 className="text-3xl font-bold mb-2">{tourney.name}</h1>
<p className="text-sm text-gray-600 mb-4">Format: {tourney.format}</p>


{/* Render fixtures simply for MVP */}
{tourney.fixtures.groups ? (
<div>
<h2 className="text-xl font-semibold mb-2">Groups</h2>
{tourney.fixtures.groups.map((g) => (
<div key={g.groupName} className="mb-4 border p-3 rounded">
<h3 className="font-semibold">{g.groupName}</h3>
<ul className="mt-2">
{g.matches.map((m, idx) => (
<li key={idx} className="text-sm">{m.teamA} vs {m.teamB} — {m.scoreA ?? '-'} : {m.scoreB ?? '-'}</li>
))}
</ul>
</div>
))}
</div>
) : tourney.fixtures.matches ? (
<div>
<h2 className="text-xl font-semibold mb-2">Matches</h2>
<ul>
{tourney.fixtures.matches.map((m, idx) => (
<li key={idx} className="mb-2">{m.teamA} vs {m.teamB} — {m.scoreA ?? '-'} : {m.scoreB ?? '-'}</li>
))}
</ul>
</div>
) : (
<div>
<h2 className="text-xl font-semibold mb-2">Knockout Rounds</h2>
{tourney.fixtures.rounds.map((round, rIdx) => (
<div key={rIdx} className="mb-3">
<h3 className="font-medium">Round {rIdx + 1}</h3>
<ul>
{round.map((m, idx) => (
<li key={idx}>{m.teamA} vs {m.teamB} — {m.scoreA ?? '-'} : {m.scoreB ?? '-'}</li>
))}
</ul>
</div>
))}
</div>
)}


<div className="mt-6 text-sm text-gray-500">Note: This tournament will expire on: {new Date(tourney.expiresAt.seconds * 1000).toLocaleString()}</div>
</div>
)
}
