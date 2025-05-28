import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';

interface PointsModalProps {
  visible: boolean;
  onClose: () => void;
  testScore: number;
  diagnosisScore: number;
}

export default function PointsModal({ visible, onClose, testScore, diagnosisScore }: PointsModalProps) {
  if (!visible) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback>
          <View style={styles.tooltipContainer}>
            <View style={styles.tooltip}>
              <View style={styles.tooltipContent}>
                <Text style={styles.tooltipTitle}>Scoring System</Text>
                <View style={styles.tooltipSection}>
                  <Text style={styles.tooltipSubtitle}>Test Phase (5 points):</Text>
                  <Text style={styles.tooltipText}>• First correct attempt: 5 points</Text>
                  <Text style={styles.tooltipText}>• Each wrong attempt: -2 points</Text>
                  <Text style={styles.tooltipText}>• Contra-indicated test: 0 points</Text>
                </View>
                <View style={styles.tooltipSection}>
                  <Text style={styles.tooltipSubtitle}>Diagnosis Phase (5 points):</Text>
                  <Text style={styles.tooltipText}>• First correct attempt: 5 points</Text>
                  <Text style={styles.tooltipText}>• Each wrong attempt: -2 points</Text>
                </View>
                <View style={styles.tooltipSection}>
                  <Text style={styles.tooltipSubtitle}>Your Current Scores:</Text>
                  <Text style={styles.tooltipText}>• Test Score: {testScore}/5</Text>
                  <Text style={styles.tooltipText}>• Diagnosis Score: {diagnosisScore}/5</Text>
                </View>
              </View>
              <View style={styles.tooltipArrow} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  tooltipContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1000,
  },
  tooltip: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    width: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tooltipContent: {
    gap: 8,
  },
  tooltipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C91F2',
    marginBottom: 4,
  },
  tooltipSection: {
    marginBottom: 8,
  },
  tooltipSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tooltipText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    marginBottom: 2,
  },
  tooltipArrow: {
    position: 'absolute',
    top: -8,
    right: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
  },
});
