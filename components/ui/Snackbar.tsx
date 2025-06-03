// src/components/ui/Snackbar.tsx

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import type { SnackbarProps, Variant } from '@/interfaces/components/SnackbarProps';

const COLORS: Record<Variant, string> = {
  info:    '#3B82F6', // bleu
  success: '#4ECDC4', // vert clair
  warning: '#F59E0B', // orange
  error:   '#EF4444', // rouge
};


export function Snackbar({
  message,
  variant = 'info',
  duration = 3000,
  onDismiss,
  style,
}: SnackbarProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const bgColor = COLORS[variant];

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(onDismiss);
      }, duration);
    });
  }, [anim, duration, onDismiss]);

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: bgColor },
        style,
        {
          opacity: anim,
          transform: [{
            translateY: anim.interpolate({ inputRange: [0,1], outputRange: [50,0] })
          }],
        },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
      <TouchableOpacity onPress={onDismiss} hitSlop={{ top:10, bottom:10, left:10, right:10 }}>
        <Text style={styles.action}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
  },
  text: {
    color: 'white',
    flex: 1,
    marginRight: 8,
  },
  action: {
    color: 'white',
    fontSize: 18,
  },
});
