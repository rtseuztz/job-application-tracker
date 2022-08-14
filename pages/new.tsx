import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import newStyles from '../styles/New.module.css'
import $ from 'jquery'
import { FormEvent, MouseEventHandler, useEffect, useRef, useState } from 'react';
import 'firebaseui/dist/firebaseui.css'
import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAJG719mWF0NIjf-YtVG2RqJV081jOqbs0",
  authDomain: "social-media-manager-b449a.firebaseapp.com",
  projectId: "social-media-manager-b449a",
  storageBucket: "social-media-manager-b449a.appspot.com",
  messagingSenderId: "606247064791",
  appId: "1:606247064791:web:f5dc7ce2653e35354dcc92",
  measurementId: "G-TGHNY65FH9"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const Home: NextPage = () => {
  const container =useRef(null);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("")
  const addUser = (event: FormEvent<HTMLFormElement>) => {
    const selector = container.current || document.body;
    setLoading(true);
    const email = (selector.querySelector("#email") as HTMLInputElement).value
    const password = (selector.querySelector("#password") as HTMLInputElement).value
    if (!email || !password)
      return;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        setWarning("")
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setWarning(errorMessage)
        event.preventDefault();
        // ..
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Social Media Manager</title>
        <meta name="description" content="Manage you social media today" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main ref={container} className={styles.main}>
        <form action="/" className={newStyles.columnFlex} onSubmit={e => addUser(e)}>
          <div className={[newStyles.absolute, newStyles.columnFlex].join(" ")}>
            <h1 className={styles.title}>Welcome</h1>
            <input id="email" className={newStyles.subtitle} placeholder="email" disabled={loading}/>
            <input id="password" className={newStyles.subtitle} placeholder="password" disabled={loading}></input>
            <button type="submit">Create Account</button>
          </div>
          {loading ? <div className={newStyles.absolute}>
            <div className={newStyles.ldsRing}><div></div><div></div><div></div><div></div></div>
          </div> : <></>}
        </form>
        {warning != "" ? <div className={newStyles.warning}>{warning}</div>
          : <></>}
      </main>
    </div>
  )
}

export default Home
