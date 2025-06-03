import React, { useContext, useEffect } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';

import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

export default function FacebookLoginButton() {
  const { user, signInWithFacebook, signOut } = useContext(AuthContext);
  const router = useRouter();

  // Redirige si déjà connecté
  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user]);

  const handleFBLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled) return;
      const data = await AccessToken.getCurrentAccessToken();
      if (data?.accessToken) {
        await signInWithFacebook(data.accessToken.toString());
      }
    } catch (err) {
      console.error('FB Login Error:', err);
    }
  };

  const handleFBLogout = async () => {
    try {
      LoginManager.logOut();    // SDK FB
      await signOut();          // API + AsyncStorage
    } catch (err) {
      console.error('FB Logout Error:', err);
    }
  };

  return (
    <View style={styles.container}>
      {user
        ? <Button title="Se déconnecter de Facebook" onPress={handleFBLogout} />
        : <Button title="Se connecter avec Facebook" onPress={handleFBLogin} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    alignItems: 'center',
  },
});
