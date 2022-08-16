/** @type {import('next').NextConfig} */
module.exports = (phase) => {
  reactStrictMode = true
  swcMinify = true
  const env = {
    apiKey: "AIzaSyAJG719mWF0NIjf-YtVG2RqJV081jOqbs0",
    authDomain: "social-media-manager-b449a.firebaseapp.com",
    projectId: "social-media-manager-b449a",
    storageBucket: "social-media-manager-b449a.appspot.com",
    messagingSenderId: "606247064791",
    appId: "1:606247064791:web:f5dc7ce2653e35354dcc92",
    measurementId: "G-TGHNY65FH9"
  }
  return {
    env
  }
}
