// app/(app)/_layout.tsx

import { Redirect, Slot } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ui/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { setupI18n } from '@/i18n';

export default function ProtectedLayout() {
  const { user, loading: authLoading } = useAuth();
  const [i18nReady, setI18nReady] = useState(false);

  // Charger i18n au démarrage
  useEffect(() => {
    (async () => {
      const locale = 'fr'; // ou détecte dynamiquement
      try {
        await setupI18n(locale);
      } catch (e) {
        console.error('Erreur i18n:', e);
      } finally {
        setI18nReady(true);
      }
    })();
  }, []);

  // Tant que l’authentification OU la config i18n ne sont pas finies, afficher un loader
  if (authLoading || !i18nReady) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </ThemedView>
    );
  }

  // Si l’utilisateur n’est pas connecté, rediriger vers /login
  if (!user) {
    return <Redirect href="/login" />;
  }

  // Authentifié + i18n prêt → afficher les écrans protégés
  return <Slot />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
