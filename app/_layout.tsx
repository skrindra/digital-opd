// app/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        animation: 'none',
        animationDuration: 0
      }}
    />
  );
}
