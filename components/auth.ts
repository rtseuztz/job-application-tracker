import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyAJG719mWF0NIjf-YtVG2RqJV081jOqbs0",
  authDomain: "social-media-manager-b449a.firebaseapp.com",
  projectId: "social-media-manager-b449a",
  storageBucket: "social-media-manager-b449a.appspot.com",
  messagingSenderId: "606247064791",
  appId: "1:606247064791:web:f5dc7ce2653e35354dcc92",
  measurementId: "G-TGHNY65FH9"
};
export const app = initializeApp(firebaseConfig);
export let user: any
export const auth = getAuth();

console.log(auth.currentUser?.email ?? "no user");
auth.onAuthStateChanged((newUser) => {
  if (newUser) {
    user = newUser
  } else {
  }
});