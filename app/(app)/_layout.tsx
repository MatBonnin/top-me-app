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

  useEffect(() => {
    (async () => {
      const locale = 'fr';
      try {
        await setupI18n(locale);
      } catch (e) {
        console.error('Erreur i18n:', e);
      } finally {
        setI18nReady(true);
      }
    })();
  }, []);

  if (authLoading || !i18nReady) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </ThemedView>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  // ← ici on enveloppe Slot pour appliquer SafeArea et theme
  return (
    <ThemedView style={{ flex: 1 }}>
      <Slot />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
