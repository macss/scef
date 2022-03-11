import { GoogleAuthProvider } from '@firebase/auth';
import { auth } from 'config/firebaseConfig';
import firebaseui from 'firebaseui';
import React, { useEffect } from 'react'

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID
  ],
};

const UI_DIV = 'firebaseui-element'

const LoginForm = () => {
  useEffect(() => {
    const ui = new firebaseui.auth.AuthUI(auth)

    if (typeof window !== 'undefined')
      ui.start(UI_DIV, uiConfig)
  }, [])

  return (
    <div id={UI_DIV}></div>
  )
}

export default LoginForm