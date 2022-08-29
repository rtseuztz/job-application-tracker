import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react'
import {getFirestore, getDoc, collection, Firestore, query, where, doc, DocumentData, getDocs} from 'firebase/firestore'
import { LayoutProps } from './layout/layout';
import _ from 'underscore'
// https://stackoverflow.com/questions/68104551/react-firebase-authentication-and-usecontext
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
const db = getFirestore(app)
const auth = getAuth(app);
const AuthContext = createContext({})

export function useAuth() {
  return useContext(AuthContext)
}

const DataContext = createContext({})

export function useData() {
  return useContext(DataContext)
}
type jobArr = {
  jobs: Array<string>
}
export type job = {
  company: string,
  salary: number,
  title: string,
  uid: string,
  jid: string,
}

export function AuthProvider({ children }: LayoutProps) {
  const [currentUser, setCurrentUser] = useState<User | null>()
  const [userData, setUserData] = useState<Array<job>>([])

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

  function getData() {
    return userData
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

  useEffect(() => {
    if (!currentUser) {
      setUserData([]);
      return;
    }
    const loadInData = async () => {
      const docRef = doc(db, "users", currentUser!.uid);
      const docSnap = await getDoc(docRef);
      setLoading(true);
      setUserData([])
      if (!docSnap.exists()) {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      } else {
        const jobArr: jobArr = docSnap.data() as jobArr
        if (!jobArr || !jobArr.jobs || jobArr.jobs.length == 0) {

        } else {
          const jobsRef = collection(db, "jobs")
          const q = query(jobsRef, where('__name__', 'in', jobArr.jobs));
          const querySnapshot = await getDocs(q);
          let tempJobArr: Array<job> = [];
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            var dataObj = doc.data()
            dataObj.jid = doc.id;
            const jobObj = dataObj as job
            tempJobArr.push(jobObj)
          });
          setUserData(tempJobArr)
          setLoading(false);
        }
      }
    }
    console.log("auth email is " + currentUser?.email)
    //get new user data
    loadInData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, currentUser?.email])


  const value = {
    currentUser,
    getUser,
    login,
    signOut,
    signUp,
  }
  const dataValue = {
    getData
  }
  return (
    <AuthContext.Provider value={value}>
      <DataContext.Provider value={dataValue}>
        { !loading && children }
      </DataContext.Provider>
    </AuthContext.Provider>
  )

}