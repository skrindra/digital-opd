import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

type PointsModalProps = {
  visible: boolean;
  onClose: () => void;
  testScore: number | null;
  diagnosisScore: number | null;
};

export default function PointsModal({ visible, onClose, testScore, diagnosisScore }: PointsModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 10,
            width: '80%',
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
            🧮 Points Breakdown
          </Text>
          <Text>🧪 Lab Test: {testScore !== null ? `${testScore}/5` : '—'}</Text>
          <Text>🧠 Diagnosis: {diagnosisScore !== null ? `${diagnosisScore}/5` : '—'}</Text>
          <Text style={{ marginTop: 8 }}>✅ First try = 5 pts</Text>
          <Text>❌ -2 pts per wrong attempt</Text>
          <Text>⚠️ Contra-indicated test = 0 pts</Text>
        </View>
      </Pressable>
    </Modal>
  );
}
