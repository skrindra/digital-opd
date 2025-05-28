import React, { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  StyleSheet,
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
        {nextId ? (
          <Pressable
            style={styles.nextButton}
            onPress={() => router.push(`/patient/${nextId}`)}
          >
            <Text style={styles.nextButtonText}>Next Patient</Text>
          </Pressable>
        ) : (
          <View style={styles.completionContainer}>
            <Text style={styles.completionText}>🎉 All Cases Completed!</Text>
            <View style={styles.completionButtons}>
              <Pressable
                style={[styles.completionButton, { backgroundColor: '#1C91F2' }]}
                onPress={() => router.push('/')}
              >
                <Text style={styles.completionButtonText}>Home</Text>
              </Pressable>
              <Pressable
                style={[styles.completionButton, { backgroundColor: '#28a745' }]}
                onPress={() => router.push('/patient/1')}
              >
                <Text style={styles.completionButtonText}>Retry</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  completionContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  completionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C91F2',
    marginBottom: 20,
  },
  completionButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  completionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  completionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#167ADF',
    paddingVertical: 12,
    paddingHorizontal: 98,
    borderRadius: 10,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
