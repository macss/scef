import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from '@firebase/auth';
import { USER_ACCESS_TYPE, USER_STATUS, USER_TYPE } from '@lib/models/user';
import addData from '@lib/services/addData';
import readData from '@lib/services/readData';
import { Google } from '@mui/icons-material';
import { Button, Container } from '@mui/material';
import { auth } from 'config/firebaseConfig';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'

const Login = () => {
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user)
        router.push('/')
    })

    return unsubscribe
  }, [router])
  
  const handleClick = () => {
    const provider = new GoogleAuthProvider()

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;

        readData('users', user.uid)
          .then(result => {
            if (result.code === 'NOT REGISTERED') {
              addData({
                email: user.email,
                access_type: USER_ACCESS_TYPE['Usuário'],
                status: USER_STATUS['Aguardando Aprovação'],
                uid: user.uid,
                type: USER_TYPE['Indefinido']
              }, 'users')
            }
          })
        
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  return (
    <Container 
      maxWidth="xl" 
      sx={{
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        my: 16
      }}>
        <Button startIcon={<Google />} color="info" variant="contained" onClick={handleClick}>
          Entrar com google
        </Button>
    </Container>
  )
}

Login.getLayout = (page: any) => page

export default Login