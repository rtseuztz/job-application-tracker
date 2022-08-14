import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import newStyles from '../styles/New.module.css'
import $ from 'jquery'
// Import the functions you need from the SDKs you need
//import { getAnalytics } from "firebase/analytics";
import { MouseEventHandler, useEffect, useRef } from 'react';

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
  const container=useRef(null);
  useEffect( () => {
    container.current = $(container.current)
  }, [])
  console.log(container);
  const addUser: MouseEventHandler<HTMLButtonElement> = (e: any) => {
    console.log(container);
    if (!container)
      return;
    const selector = container?.current ?? $("main");
    if(!selector) return;
    const email = selector.find("#email")
    const password = selector.find("#password")
    console.log(e)
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Social Media Manager</title>
        <meta name="description" content="Manage you social media today" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main ref={container} className={styles.main}>
        <h1 className={styles.title}>Welcome</h1>
        <input id="email" className={newStyles.subtitle} placeholder="email"/>
        <input id="password" className={newStyles.subtitle} placeholder="password"></input>
        <button onClick={addUser}>Create</button>
      </main>
    </div>
  )
}

export default Home
