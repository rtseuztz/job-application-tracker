import '../styles/globals.css'
import styles from '../styles/Main.module.css'
import type { AppProps } from 'next/app'
import NavBar from '../components/navbar'
import Footer from '../components/footer'
import { initializeApp } from 'firebase/app'
import Layout from '../components/layout'
import { AuthProvider } from '../components/authContext'



function MyApp({ Component, pageProps }: AppProps) {
  console.log("app running")

  return <AuthProvider><Layout><Component {...pageProps} /></Layout></AuthProvider>
}

export default MyApp
