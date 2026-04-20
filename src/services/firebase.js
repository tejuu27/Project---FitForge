import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDuGotztL2IQ8vMCV28Owsv7bI_P0gXzg0",
  authDomain: "fitforge-46ae8.firebaseapp.com",
  projectId: "fitforge-46ae8",
  storageBucket: "fitforge-46ae8.firebasestorage.app",
  messagingSenderId: "1061514616401",
  appId: "1:1061514616401:web:93cc0f129039455677e270",
  measurementId: "G-TB94HSNFMT"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()