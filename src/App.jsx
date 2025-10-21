import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import CreateTournament from './pages/CreateTournament'
import TournamentDetail from './pages/TournamentDetail'
import GoogleAuthButton from './components/GoogleAuthButton'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
          <Link to="/" className="font-bold text-xl text-gray-800 hover:text-green-700 transition">
            Tourneygen
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/create"
              className="px-3 py-1 border rounded hover:bg-gray-100 transition"
            >
              Create
            </Link>
            <GoogleAuthButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateTournament />} />
          <Route path="/tournament/:id" element={<TournamentDetail />} />
        </Routes>
      </main>
    </div>
  )
}

function Home() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold mb-3 text-gray-800">Tourneygen</h1>
      <p className="text-gray-600 mb-6">
        Create and manage FIFA tournaments in seconds.
        <br />
        No sign-in required — or sign in with Google to save your tournaments.
      </p>
      <Link
        to="/create"
        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Start Tournament
      </Link>
    </div>
  )
}
