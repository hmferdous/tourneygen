import React from 'react'
import { useAuth } from '../context/AuthContext'


export default function GoogleAuthButton() {
const { user, signInWithGoogle, logout } = useAuth()
if (user) {
return (
<div className="flex items-center gap-2">
<img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full" />
<span className="text-sm">{user.displayName}</span>
<button onClick={logout} className="ml-2 px-3 py-1 bg-gray-200 rounded">Logout</button>
</div>
)
}
return (
<button onClick={signInWithGoogle} className="px-4 py-2 bg-blue-600 text-white rounded">Sign in with Google to save</button>
)
}