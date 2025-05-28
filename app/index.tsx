// app/index.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import '../lib/icons';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Digital</Text>
        <Text style={styles.subtitle}>OPD</Text>
        <View style={styles.divider} />
        <Text style={styles.tagline}>Virtual Medical Training Platform</Text>
      </View>

      <Pressable
        style={styles.startButton}
        onPress={() => router.push('/patient/1')}
      >
        {/* <FontAwesomeIcon icon={['fas', 'stethoscope']} size={24} color="#fff" style={styles.buttonIcon} /> */}
        <Text style={styles.buttonText}>Start Training</Text>
      </Pressable>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: height * 0.15,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1C91F2',
    letterSpacing: 2,
    textShadowColor: 'rgba(28, 145, 242, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 72,
    fontWeight: '900',
    color: '#1C91F2',
    letterSpacing: 4,
    marginTop: -10,
    textShadowColor: 'rgba(28, 145, 242, 0.2)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  divider: {
    width: width * 0.4,
    height: 4,
    backgroundColor: '#1C91F2',
    marginVertical: 20,
    borderRadius: 2,
  },
  tagline: {
    fontSize: 18,
    color: '#666',
    letterSpacing: 1,
    marginTop: 10,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C91F2',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: '#1C91F2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
