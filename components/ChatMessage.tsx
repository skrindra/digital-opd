import { View, Text } from 'react-native';
import React from 'react';

export default function ChatMessage({
  sender,
  message,
  header,
}: {
  sender: 'doctor' | 'user' | 'patient';
  message: string;
  header?: string;
}) {
  const alignSelf = sender === 'user' ? 'flex-end' : 'flex-start';
  const bgColor =
    sender === 'user' ? '#DCF8C6' :
    sender === 'doctor' ? '#EEE' :
    '#F0F8FF';

  return (
    <View style={{ marginVertical: 4, maxWidth: '80%', alignSelf }}>
      {header && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#666'}}>{header.split('  ')[0]}</Text>
          <Text style={{ fontSize: 12, color: '#666'}}>{header.split('  ')[1]}</Text>
        </View>
      )}
      <View
        style={{
          backgroundColor: bgColor,
          padding: 10,
          borderRadius: 8,
        }}
      >
        <Text style={{ fontSize: 14}}>{message}</Text>
      </View>
    </View>
  );
}
