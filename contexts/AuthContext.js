import firebase from '../lib/firebase'
import cookie from 'js-cookie'
import Router from 'next/router'
import { createContext, useState, useEffect } from 'react'

const AuthContext = createContext()
const formatUser = async (user) => ({
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    token: user.za,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL
})

export function AuthProvider({ children }) {
    const [user, setUSer] = useState(null)
    const [loading, setLoading] = useState(true)
    const handleUser = async (currentUser) => {
        if (currentUser) {
            const formatedUser = await formatUser(currentUser)
            setUSer(formatedUser)
            setSession(true)

            return formatUser.email
        }
        setUSer(false)
        setSession(false)

        return false
    }
    const setSession = (session) => {
        if (session) {
            cookie.set('note', session, {
                expires: 1
            })
        } else {
            cookie.remove('note')
        }
    }
    const signinGitHub = async () => {
        try {
            setLoading(true)
            const response = await firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider())
            handleUser(response.user)
            Router.push('/note')
        } finally {
            setLoading(false)
        }
    }
    const signinGoogle =  async () => {
        try {
            setLoading(true)
            const response = await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
            handleUser(response.user)
            Router.push('/note')
        } finally {
            setLoading(false)
        }
    }
    const signout = async () => {
        try {
            Router.push('/')
            await firebase.auth().signOut()
            handleUser(false)
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        const unsubscribe = firebase.auth().onIdTokenChanged(handleUser)

        return () => unsubscribe()
    }, [])

    return <AuthContext.Provider value={{
        user,
        loading,
        signinGitHub,
        signinGoogle,
        signout
    }}>{children}</AuthContext.Provider>
}

export const AuthConsumer = AuthContext.Consumer

export default AuthContext