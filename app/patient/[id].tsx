import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { patients } from '../../lib/patient-data';
import ChatMessage from '../../components/ChatMessage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import '../../lib/icons';
import { getAIResponse, AIChatMessage } from '../../lib/ai-service';

import Banner from '../../components/Banner';
import PointsModal from '../../components/PointsModal';


export default function PatientScreen() {
  const { id } = useLocalSearchParams();
  const patient = patients[id as string];
  const flatListRef = useRef<FlatList>(null);

  const emoji = patient.gender === 'Female' ? '👩‍⚕️' : '👨‍⚕️';
  const userEmoji = patient.gender === 'Female' ? '👩' : '👨';
  const title = patient.gender === 'Female' ? 'Ms.' : 'Mr.';
  const name = patient.name || 'Patient';

  const [infoVisible, setInfoVisible] = useState(false);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<'test' | 'diagnosis' | 'done'>('test');
  const [attempts, setAttempts] = useState({ test: 0, diagnosis: 0 });
  const [testScore, setTestScore] = useState<number | null>(null);
  const [diagnosisScore, setDiagnosisScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'patient',
      text: `Hi, Dr. Shreya. Good to see you.\n\nI've been experiencing ${patient.symptoms.toLowerCase()}. ${
        patient.history ? "I'm also concerned because of my history of " + patient.history.toLowerCase() + "." : ""
      }`,
    },
    {
      id: 2,
      sender: 'assistant',
      header: `👩‍⚕️ SENIOR AI DOCTOR 🔊`,
      text: `Case Brief: ${patient.age}-year-old ${patient.gender.toLowerCase()}${
        patient.history ? ` with ${patient.history}` : ''
      } presenting with ${patient.symptoms.toLowerCase()}.\n\nWhat diagnostic test would you recommend?`,
    },
  ]);

  const totalScore = (testScore ?? 0) + (diagnosisScore ?? 0);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

    //   get the updated conversation history or message list
  const getAIMessages = (currentMessages: typeof messages): AIChatMessage[] => {
    const systemMessage: AIChatMessage = {
      role: 'system',
      content: `You are a senior doctor in a teaching hospital. You are helping a junior doctor diagnose a patient. The patient is a ${patient.age}-year-old ${patient.gender.toLowerCase()}${
        patient.history ? ` with a history of ${patient.history}` : ''
      }. They present with ${patient.symptoms.toLowerCase()}. ${
        patient.additionalInfo ? patient.additionalInfo + '.' : ''
      }

      IMPORTANT: You must enforce the correct phase order:
      - In the test phase (when user hasn't suggested the correct test yet):
        * Only evaluate test suggestions
        * If user suggests a diagnosis, respond with "INCORRECT_TEST:" and guide them to suggest a test first
        * Do not evaluate or accept any diagnosis until the correct test has been suggested
      - In the diagnosis phase (after correct test has been suggested):
        * Only evaluate diagnosis suggestions
        * If user suggests another test, remind them they need to provide a diagnosis

      Your response MUST start with one of these markers ONLY when evaluating a test or diagnosis suggestion:
      For tests:
      - "CORRECT_TEST:" if the test concept matches completely (all required components present)
      - "CONTRA_TEST:" if the test is in the contra-indicated list (MUST use this exact marker for any test in ${JSON.stringify(patient.contraIndicatedTests)})
      - "INCORRECT_TEST:" for any other test

      For diagnoses:
      - "CORRECT_DIAGNOSIS:" if the diagnosis concept matches completely (ONLY in diagnosis phase)
      - "INCORRECT_DIAGNOSIS:" for any other diagnosis (ONLY in diagnosis phase)

      After the marker, provide your response:
      - For correct test: First briefly explain the test, then share the results: "${patient.additionalInfo}", and finally ask for diagnosis
      - For contra-indicated test: Start with "⚠️ CAUTION: " and briefly explain why this test is not appropriate in this specific case. Focus on:
        * The specific risks or complications for this patient
        * Why this test could delay critical care
        * What type of test would be more appropriate (without revealing the exact test)
        Then ask for their diagnosis
      - For incorrect test: Provide educational guidance without revealing the answer. Consider:
        * What aspects of the case suggest this test might not be optimal?
        * What key findings would we need to confirm?
        * What type of test would best visualize/assess the affected area?
      - For correct diagnosis: Congratulate them
      - For incorrect diagnosis: Provide constructive feedback without revealing the answer. Consider:
        * What aspects of the case history are important?
        * What do the test results suggest?
        * What other conditions should be considered?

      For general conversation or questions (no markers):
      - Be professional and helpful
      - Guide the conversation back to the diagnostic process
      - Remind them to suggest a test or diagnosis when appropriate

      Keep responses brief and professional. Remember, you're teaching a junior doctor, so be encouraging while maintaining high standards. Never reveal the correct answer directly - guide them to discover it through the clinical reasoning process.`
    };

    const chatMessages: AIChatMessage[] = currentMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    return [systemMessage, ...chatMessages];
  };

  const send = async () => {
    if (step === 'done' || !input.trim()) return;

    const normalized = input.trim().toLowerCase();
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      header: `YOU ${userEmoji}`,
      text: input,
    };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    scrollToBottom();

    // Increment attempts counter at the start of each send
    const updatedAttempts = { ...attempts };
    if (step === 'test') {
      updatedAttempts.test += 1;
    } else if (step === 'diagnosis') {
      updatedAttempts.diagnosis += 1;
    }
    setAttempts(updatedAttempts);

    // Get AI response
    setIsLoading(true);
    try {
      console.log('Sending messages to AI:', next.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })));
      const aiResponse = await getAIResponse(getAIMessages(next));
      if (aiResponse.error) {
        console.error('AI Error:', aiResponse.error);
      } else if (aiResponse.message) {
        const responseText = aiResponse.message;
        console.log('AI Response:', responseText);
        let score: number | null = null;
        let updatedStep = step;
        let updatedTestScore = testScore;
        let updatedDiagnosisScore = diagnosisScore;

        // Parse the response marker
        let marker = '';
        if (responseText.startsWith('CORRECT_TEST:')) {
          marker = 'CORRECT_TEST';
          // Calculate score based on attempts
          score = Math.max(5 - 2 * (updatedAttempts.test - 1), 0);
          updatedTestScore = score;
          updatedStep = 'diagnosis';
        } else if (responseText.startsWith('CONTRA_TEST:')) {
          marker = 'CONTRA_TEST';
          score = 0;
          updatedTestScore = score;
          updatedStep = 'diagnosis';
        } else if (responseText.startsWith('INCORRECT_TEST:')) {
          marker = 'INCORRECT_TEST';
        } else if (responseText.startsWith('CORRECT_DIAGNOSIS:') && step === 'diagnosis') {
          marker = 'CORRECT_DIAGNOSIS';
          // Calculate score based on attempts
          score = Math.max(5 - 2 * (updatedAttempts.diagnosis - 1), 0);
          updatedDiagnosisScore = score;
          updatedStep = 'done';
        } else if (responseText.startsWith('INCORRECT_DIAGNOSIS:') && step === 'diagnosis') {
          marker = 'INCORRECT_DIAGNOSIS';
        } else if (responseText.startsWith('CORRECT_DIAGNOSIS:') && step === 'test') {
          // If user tries to give diagnosis in test phase, treat as incorrect test
          marker = 'INCORRECT_TEST';
        }

        // If no marker found but response contains "CAUTION", treat as contra test
        if (!marker && responseText.includes('CAUTION')) {
          marker = 'CONTRA_TEST';
          score = 0;
          updatedTestScore = score;
          updatedStep = 'diagnosis';
        }

        console.log('Response Analysis:', {
          marker,
          score,
          updatedAttempts,
          updatedStep,
          updatedTestScore,
          updatedDiagnosisScore
        });

        // Remove the marker from the response text
        const cleanResponse = responseText.replace(/^(CORRECT|INCORRECT|CONTRA)_(TEST|DIAGNOSIS):/, '').trim();

        // Only show points in header for correct/contra-indicated responses
        const showPoints = marker === 'CORRECT_TEST' || marker === 'CONTRA_TEST' || marker === 'CORRECT_DIAGNOSIS';
        const headerPoints = showPoints ? `  ${marker === 'CORRECT_DIAGNOSIS' ? updatedDiagnosisScore : updatedTestScore}/5 Points` : '';

        console.log('Header Points:', { showPoints, headerPoints });

        // Update all states at once
        setStep(updatedStep);
        setTestScore(updatedTestScore);
        setDiagnosisScore(updatedDiagnosisScore);

        // Add the new message with the updated score
        const assistantMsg = {
          id: Date.now(),
          sender: 'assistant',
          header: `👩‍⚕️ SENIOR AI DOCTOR 🔊${headerPoints}`,
          text: cleanResponse,
        };
        console.log('Adding assistant message:', assistantMsg);
        setMessages(prev => [...prev, assistantMsg]);

        scrollToBottom();
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={60}
    >
      <View style={{ flex: 1 }}>
        {/* TOP BANNER */}
        <Banner
        name={name}
        age={patient.age}
        gender={patient.gender}
        totalScore={totalScore}
        onInfoPress={() => setInfoVisible(true)}
        />

        {/* POINTS MODAL */}
        <PointsModal
        visible={infoVisible}
        onClose={() => setInfoVisible(false)}
        testScore={testScore}
        diagnosisScore={diagnosisScore}
        />

        {/* CHAT */}
        <View style={{ flex: 1, padding: 16 }}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ChatMessage
                sender={item.sender as any}
                message={item.text}
                header={item.header}
              />
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </View>

        {/* INPUT or PASS/FAIL BUTTON */}
        {step === 'done' ? (
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: `/score/${id}`,
                  params: {
                    name,
                    gender: patient.gender,
                    age: String(patient.age),
                    testScore: String(testScore ?? 0),
                    diagnosisScore: String(diagnosisScore ?? 0),
                    total: String(totalScore),
                    id: id as string,
                  }
                })
              }
              style={{
                backgroundColor: totalScore >= 7 ? '#4CAF50' : '#F44336',
                paddingVertical: 12,
                paddingHorizontal: 80,
                borderRadius: 30,
              }}
            >
              <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}>
                {totalScore >= 7 ? 'Pass >>' : 'Fail >>'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              marginBottom: 30,
            }}
          >
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder={step === 'test' ? 'Enter diagnostic test' : 'Enter diagnosis'}
              style={{
                flex: 1,
                borderColor: '#CCC',
                borderWidth: 1,
                borderRadius: 8,
                padding: 8,
                marginRight: 8,
                marginBottom: 4,
                backgroundColor: '#fff',
              }}
            />
            <Pressable
              onPress={input ? send : undefined}
              disabled={isLoading}
              style={{
                backgroundColor: '#1C91F2',
                padding: 10,
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <FontAwesomeIcon icon={['fas', 'paper-plane']} size={18} color="#fff" />
              )}
            </Pressable>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
