// app/index.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { router } from 'expo-router';


export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Digital OPD 👨‍⚕️</Text>
      <Button color={"#1C91F2"} title="Start Case #1" onPress={() => router.push('/patient/1')} />
      <Button color={"#1C91F2"} title="Score #1" onPress={() => router.push('/score/1')} />
    </View>
  );
}
