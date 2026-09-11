import { getAuth, signInWithEmailAndPassword, signOut, signInWithCustomToken } from 'firebase/auth'
import { app } from './config'

export const auth = getAuth(app)

export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)

export const loginWithCustomToken = (token) =>
  signInWithCustomToken(auth, token)

export const logout = () => signOut(auth)
