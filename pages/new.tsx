import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import newStyles from '../styles/New.module.css'
import { FormEvent, ReactNode, useRef, useState } from 'react';
import 'firebaseui/dist/firebaseui.css'
import { createUserWithEmailAndPassword } from "firebase/auth";
import * as Auth from '../components/auth'
import Layout from '../components/layout';

const app = Auth.app
const auth = Auth.auth

const NewUser: NextPage = () => {
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
      event.preventDefault();
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
// NewUser.getLayout = function getLayout(page: ReactNode) {
//   return (
//     <Layout>
//       {page}
//     </Layout>
//   )
// }
export default NewUser
