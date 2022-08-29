import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import Layout from '../components/layout/layout';
import { useData, job } from '../components/authContext';
import _ from 'underscore';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const Home: NextPage  = () => {
  const {getData}: any = useData()
  const userData: Array<job> = getData();
  return (
    <div className={styles.container}>
      <Head>
        <title>Job Tracker</title>
        <meta name="description" content="Manage you social media today" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.jobTable}>
          <div className={styles.jobTableHeader}>
            <div>Jobs</div>
            <div>Add job</div>
          </div>
          {_.map(userData, data => {
            return ( 
              <div className={styles.job}>
                <div>
                  {data.jid}
                </div>
                <div>
                  {data.company}
                </div>
                <div>
                  {data.title}
                </div>
                <div>
                  {formatter.format(data.salary)}
                </div>
                <div className={styles.hidden}>
                  trash
                </div>
              </div>
            )
          })}
        </div>
        
      </main>


    </div>
  )
}
export default Home
