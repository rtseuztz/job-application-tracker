import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import * as Auth from '../components/auth'
import { useAuth } from '../components/authContext'

const NavBar: NextPage = () => {

  const {getUser, signOut}: any = useAuth()
  const user = getUser();
  const signUserOut = () => {
    signOut()
  }
    return (
        <nav className={styles.navBar}>
          <span className={styles.logo}>
            <Image src="/hamburger.svg" alt="More options" title="More options..." width={72} height={22} />
          </span>
          {user == null ? 
          <a href="login">Log in</a>
           : 
           <>
            <div>{user.email}</div>
            <button onClick={signUserOut}>Sign out</button>
           </>
           }
        </nav>
    )
}
export default NavBar