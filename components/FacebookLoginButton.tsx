// components/FacebookLoginButton.tsx

import React, { useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { AccessToken, LoginButton } from 'react-native-fbsdk-next'

import { AuthContext } from '@/context/AuthContext'
import { useRouter } from 'expo-router'

export default function FacebookLoginButton() {
  const { signInWithFacebook } = useContext(AuthContext)
  const router = useRouter()

  const handleLoginFinished = (error: any, result: { isCancelled: boolean }) => {
    if (error) {
      console.error('FB Login Error:', error)
    } else if (result.isCancelled) {
      console.log('FB Login Cancelled')
    } else {
      AccessToken.getCurrentAccessToken().then(data => {
        if (data?.accessToken) {
          signInWithFacebook(data.accessToken.toString())
            .then(() => {
              router.replace('/') // Redirige vers la page d'accueil après succès
            })
            .catch((err: any) => {
              console.error('FB signInWithFacebook error:', err)
            })
        }
      })
    }
  }

  return (
    <View style={styles.container}>
      <LoginButton
        permissions={["public_profile", "email"]}
        onLoginFinished={handleLoginFinished}
        onLogoutFinished={() => console.log('FB Logout')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    alignItems: 'center',
  },
})
