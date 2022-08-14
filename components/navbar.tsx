import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
const NavBar: NextPage = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyAJG719mWF0NIjf-YtVG2RqJV081jOqbs0",
    authDomain: "social-media-manager-b449a.firebaseapp.com",
    projectId: "social-media-manager-b449a",
    storageBucket: "social-media-manager-b449a.appspot.com",
    messagingSenderId: "606247064791",
    appId: "1:606247064791:web:f5dc7ce2653e35354dcc92",
    measurementId: "G-TGHNY65FH9"
  };
  const [user, setUser] = useState<firebase.UserInfo | null>(null);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
        console.log("user is " + user)
      } else {
        console.log("no user")

      }
    });
    return unsubscribe;
  }, [auth]);

  console.log(user);
    return (
        <nav className={styles.navBar}>
          <span className={styles.logo}>
            <Image src="/hamburger.svg" alt="More options" title="More options..." width={72} height={22} />
          </span>
          {user == null ? <a href="login">Log in</a> : <div>{user.email}</div>}
        </nav>
    )
}
export default NavBar