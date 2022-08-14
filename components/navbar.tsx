import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const NavBar: NextPage = () => {
    return (
        <nav className={styles.navBar}>
          <span className={styles.logo}>
            <Image src="/hamburger.svg" alt="More options" title="More options..." width={72} height={22} />
          </span>
          <a href="login">Log in</a>
        </nav>
    )
}
export default NavBar