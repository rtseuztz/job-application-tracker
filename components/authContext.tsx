import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react'
import {getFirestore, getDoc, collection, Firestore, query, where, doc, DocumentData, getDocs, setDoc, addDoc, FieldValue, updateDoc, DocumentReference, arrayUnion, CollectionReference, onSnapshot, DocumentSnapshot, Query, QuerySnapshot} from 'firebase/firestore'
import { LayoutProps } from './layout/layout';
import _ from 'underscore'
import { getAllContexts } from 'svelte';
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
type GetData = {
  (): Array<job>
}
export interface DataContextInterface {
  getData: () => Array<job>,
  addJob: (data: Date, title: string, company: string, salary: number) => void
}
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};
const DataContext = createContext<DataContextInterface | null>(null)

export function useData() {
  return useContext(DataContext)
}
type jobArr = {
  jobs: Array<string>
}
type jobObj = {
  jid: string,
  job: job
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
  const [userRef, setUserRef] = useState<DocumentReference<DocumentData> | undefined>(undefined)
  const [jobsRef, setJobsRef] = useState<Query<DocumentData> | undefined>(undefined)
  const [jobsCol, setJobsCol] = useState<CollectionReference<DocumentData> | undefined>(undefined)
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

  async function addJob(data: Date, title: string, company: string, salary: number ) {
  if (!jobsCol || !currentUser) {
      console.error("no user ref")
      return;
    }
    const docRef = await addDoc(jobsCol, {
      uid: currentUser.uid,
      company: company,
      title: title,
      salary: salary
    });
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
    const workerFunc = async (doc: QuerySnapshot<DocumentData>) => {
      let tempJobArr: Array<job> = [];
      doc.forEach((q: any) => {
        console.log(q.data())
          var dataObj = q.data()
          dataObj.jid = q.id;
          const jobObj = dataObj as job
          tempJobArr.push(jobObj)
      })
      setUserData(tempJobArr)
    }
    if (!jobsRef || !currentUser) return
    const unsub = onSnapshot(jobsRef, async (querySnap) => {
      setLoading(true)
      await workerFunc(querySnap)
      setLoading(false)
    });
    return unsub
  }, [currentUser, jobsRef])
  useEffect(() => {
    if (!currentUser) {
      setUserData([]);
      return;
    }
    const loadInData = async () => {
      const jobsCollection = collection(db, `users/${currentUser!.uid}/jobs`)
      setJobsCol(jobsCollection)
      const jobRef = query(jobsCollection)

      setJobsRef(jobRef)
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
  const dataValue: DataContextInterface = {
    getData,
    addJob
  }
  return (
    <AuthContext.Provider value={value}>
      <DataContext.Provider value={dataValue}>
        { !loading && children }
      </DataContext.Provider>
    </AuthContext.Provider>
  )

}