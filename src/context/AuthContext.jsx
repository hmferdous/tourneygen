import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { googleProvider } from '../firebase'


const AuthContext = createContext()


export function AuthProvider({ children }) {
const [user, setUser] = useState(null)
const [loading, setLoading] = useState(true)


useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, (u) => {
setUser(u)
setLoading(false)
})
return unsubscribe
}, [])


const signInWithGoogle = () => signInWithPopup(auth, googleProvider)
const logout = () => signOut(auth)


return (
<AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
{children}
</AuthContext.Provider>
)
}


export const useAuth = () => useContext(AuthContext)
