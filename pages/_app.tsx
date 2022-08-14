import '../styles/globals.css'
import styles from '../styles/Main.module.css'
import type { AppProps } from 'next/app'
import NavBar from '../components/navbar'
import Footer from '../components/footer'
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={styles.mainContainer}>
      <NavBar />
      <Component {...pageProps} />
      <Footer />
    </div>
      
  )
}

export default MyApp
