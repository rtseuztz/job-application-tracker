import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import navStyles from '../styles/Navbar.module.css'
import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import { useEffect, useRef, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useAuth } from '../components/authContext'
import { Modal } from './modal';
const NavBar: NextPage = () => {
  const loginBtnRef =useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const {getUser, signOut}: any = useAuth()
  const user = getUser();
  const signUserOut = () => {
    signOut()
  }
  const [shouldShowLoginModal, setShowLoginModal] = useState<boolean | undefined>(false)
  const showLoginModal = () => {
    setShowLoginModal(true)
  }
  const hideLoginModal = () => {
    setShowLoginModal(false)
  }

  
  const show = useRef<boolean | undefined>(true)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const container = modalRef.current
      if (!container) return;
      (container.contains(event.target as Node | null))
        ? ""
        : hideLoginModal()   // clicked in the modal
    }
        //hide
    document.body.addEventListener("click", handleClickOutside);
  }, [])

    return (
        <nav className={navStyles.navBar}>
          <span className={[styles.logo, navStyles.hamburger].join(" ")}>
            <Image src="/hamburger.svg" alt="More options" title="More options..." width={72} height={22} />
          </span>
          <>
            {user == null ? 
            <div ref={modalRef} className={navStyles.loginContainer}>
              <button ref={loginBtnRef} disabled={shouldShowLoginModal} className={navStyles.loginBtn} id="loginButton" onClick={showLoginModal}>Log in</button>
              <Modal show={shouldShowLoginModal} element={loginBtnRef.current as Element}>

              </Modal>
            </div>
            : 
            <>
              <div>{user.email}</div>
              <button onClick={signUserOut}>Sign out</button>
            </>
            }
          </>

        </nav>
    )
}
export default NavBar