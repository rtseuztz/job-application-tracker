import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react'
import { LayoutProps } from './layout';

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
 };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const AuthContext = createContext({})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: LayoutProps) {
  const [currentUser, setCurrentUser] = useState<any>()
  const [loading, setLoading] = useState(true)

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function signOut() {
    return auth.signOut();
  }

  function signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function getUser() {
    return auth.currentUser
  }

//   function isAdmin() {
//     return auth.currentUser.getIdTokenResult()
//     .then((idTokenResult) => {
//       if (!!idTokenResult.claims.admin) {
//         return true
//       } else {
//         return false
//       }
//     })
//   }

//   function isEditor() {

//   }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    getUser,
    login,
    signOut,
    signUp
  }

  return (
    <AuthContext.Provider value={value}>
      { !loading && children }
    </AuthContext.Provider>
  )

}