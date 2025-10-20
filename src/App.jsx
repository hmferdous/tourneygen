import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import CreateTournament from './pages/CreateTournament'
import TournamentView from './pages/TournamentView'
import GoogleAuthButton from './components/GoogleAuthButton'


export default function App() {
return (
<div>
<header className="bg-white shadow-sm">
<div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
<Link to="/" className="font-bold text-xl">Tourneygen</Link>
<div className="flex items-center gap-4">
<Link to="/create" className="px-3 py-1 border rounded">Create</Link>
<GoogleAuthButton />
</div>
</div>
</header>


<main className="py-8">
<Routes>
<Route path="/" element={<Home />} />
<Route path="/create" element={<CreateTournament />} />
<Route path="/tournament/:id" element={<TournamentView />} />
</Routes>
</main>
</div>
)
}


function Home() {
return (
<div className="max-w-4xl mx-auto p-6 text-center">
<h1 className="text-4xl font-bold mb-3">Tourneygen</h1>
<p className="text-gray-600 mb-6">Create FIFA tournaments quickly. Create as guest, sign in with Google to save.</p>
<Link to="/create" className="px-6 py-3 bg-green-600 text-white rounded">Start Tournament</Link>
</div>
)
}