// components/FacebookLoginButton.tsx

import React, { useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { AccessToken, LoginButton } from 'react-native-fbsdk-next'

import { AuthContext } from '@/context/AuthContext'

export default function FacebookLoginButton() {
  const { signInWithFacebook } = useContext(AuthContext)

  const handleLoginFinished = (error: any, result: { isCancelled: boolean }) => {
    if (error) {
      console.error('FB Login Error:', error)
    } else if (result.isCancelled) {
      console.log('FB Login Cancelled')
    } else {
      AccessToken.getCurrentAccessToken().then(data => {
        if (data?.accessToken) {
          signInWithFacebook(data.accessToken.toString())
        }
      })
    }
  }

  return (
    <View style={styles.container}>
      <LoginButton
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
