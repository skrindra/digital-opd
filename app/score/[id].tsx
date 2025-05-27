import React, { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { getNextPatientId } from '../../lib/patient-data';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Banner from '../../components/Banner';
import PointsModal from '../../components/PointsModal';



export default function ScoreScreen() {
  const params = useLocalSearchParams();
  const {
    name = 'Patient',
    gender = 'Male',
    age = '0',
    testScore = '0',
    diagnosisScore = '0',
    total = '0',
    id = '1',
  } = params;

  const [infoVisible, setInfoVisible] = useState(false);

  const totalScore = parseInt(total as string);
  const test = parseInt(testScore as string);
  const diagnosis = parseInt(diagnosisScore as string);
  const nextId = getNextPatientId(id as string);

  const success = totalScore >= 7;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Banner */}
      <Banner
        name={name as string}
        age={age as string}
        gender={gender as string}
        totalScore={totalScore}
        onInfoPress={() => setInfoVisible(true)}
      />

      {/* POINTS MODAL */}
      <PointsModal
  visible={infoVisible}
  onClose={() => setInfoVisible(false)}
  testScore={test}
  diagnosisScore={diagnosis}
/>

      {/* Main Content */}
      <View style={{ alignItems: 'center', marginTop: 200 }}>
        <Text style={{ fontSize: 20 }}>{success ? '✅' : '❌'}</Text>
        <Text style={{ fontSize: 20, marginTop: 12, fontWeight: 'bold' }}>
          YOUR SCORE
        </Text>
        <Text style={{ fontSize: 24, marginTop: 6 }}>
          {totalScore}/10 Points
        </Text>
      </View>

      {/* Section Breakdown */}
      <View
        style={{
          marginTop: 40,
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingHorizontal: 20,
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>🧪</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>LAB TEST</Text>
          <Text style={{ fontSize: 18 }}>{test}/5</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>🧠</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>DIAGNOSIS</Text>
          <Text style={{ fontSize: 18 }}>{diagnosis}/5</Text>
        </View>
      </View>

      {/* NEXT Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 50,
          left: 0,
          right: 0,
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (nextId) {
              router.push(`/patient/${nextId}`);
            } else {
              Alert.alert("🎉 Done!", "You've completed all cases.", [
                { text: "Back to Home", onPress: () => router.push("/") },
              ]);
            }
          }}
          style={{
            backgroundColor: '#167ADF',
            paddingVertical: 12,
            paddingHorizontal: 98,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>NEXT PATIENT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
