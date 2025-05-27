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
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
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
      sender: 'doctor',
      header: `👩‍⚕️ SENIOR AI DOCTOR 🔊`,
      text: `The patient is a ${patient.age}-year-old ${patient.gender.toLowerCase()}${
        patient.history ? ` with a history of ${patient.history}` : ''
      }. ${patient.gender === 'Male' ? 'He' : 'She'} presents with ${patient.symptoms.toLowerCase()}. ${
        patient.additionalInfo ? patient.additionalInfo + '.' : ''
      } Let's go to the lab to diagnose further. What test should we run?`,
    },
  ]);

  const totalScore = (testScore ?? 0) + (diagnosisScore ?? 0);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const getAIMessages = (): AIChatMessage[] => {
    const systemMessage: AIChatMessage = {
      role: 'system',
      content: `You are a senior doctor in a teaching hospital. You are helping a junior doctor diagnose a patient. The patient is a ${patient.age}-year-old ${patient.gender.toLowerCase()}${
        patient.history ? ` with a history of ${patient.history}` : ''
      }. They present with ${patient.symptoms.toLowerCase()}. ${
        patient.additionalInfo ? patient.additionalInfo + '.' : ''
      } Your role is to guide the junior doctor through the diagnostic process. Be professional but encouraging.`
    };

    const chatMessages: AIChatMessage[] = messages.map(msg => ({
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

    let updatedMessages = next;
    let text = '';
    let header = '';
    let score: number | null = null;

    if (step === 'test') {
      const isCorrect = normalized === patient.correctTest.toLowerCase();
      const isContra = patient.contraIndicatedTests?.includes(normalized);
      const updatedAttempts = attempts.test + 1;

      if (isContra) {
        score = 0;
        text = `⚠️ That test is *contra-indicated* and not appropriate in this case.`;
        setTestScore(score);
        setStep('diagnosis');
      } else if (isCorrect) {
        score = updatedAttempts === 1 ? 5 : Math.max(5 - 2 * (updatedAttempts - 1), 0);
        text = `✅ Correct. Here's the result: ${patient.additionalInfo}\n\nWhat's your diagnosis?`;
        setTestScore(score);
        setStep('diagnosis');
      } else {
        text = `❌ That test may not help. Consider something that visualizes the affected area more clearly.`;
      }

      header = `👩‍⚕️ SENIOR AI DOCTOR 🔊${score !== null ? `  ${score}/5 Points` : ''}`;
      updatedMessages = [...next, { id: Date.now() + 1, sender: 'doctor', header, text }];
      setAttempts((prev) => ({ ...prev, test: updatedAttempts }));

    } else if (step === 'diagnosis') {
      const isCorrect = normalized === patient.correctDiagnosis.toLowerCase();
      const updatedAttempts = attempts.diagnosis + 1;

      if (isCorrect) {
        score = updatedAttempts === 1 ? 5 : Math.max(5 - 2 * (updatedAttempts - 1), 0);
        text = `✅ Correct! You've completed the case.`;
        setDiagnosisScore(score);
        setStep('done');
      } else {
        text = `❌ Incorrect diagnosis. Try again.`;
      }

      header = `👩‍⚕️ SENIOR AI DOCTOR 🔊${isCorrect ? `  ${score}/5 Points` : ''}`;
      updatedMessages = [...next, { id: Date.now() + 1, sender: 'doctor', header, text }];
      setAttempts((prev) => ({ ...prev, diagnosis: updatedAttempts }));
    }

    setMessages(updatedMessages);
    setInput('');
    scrollToBottom();

    // Get AI response
    setIsLoading(true);
    try {
      const aiResponse = await getAIResponse(getAIMessages());
      if (aiResponse.error) {
        console.error('AI Error:', aiResponse.error);
      } else if (aiResponse.message) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'doctor',
          header: `👩‍⚕️ SENIOR AI DOCTOR 🔊`,
          text: aiResponse.message,
        }]);
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

        {/* INPUT */}
        {step !== 'done' && (
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

        {/* PASS/FAIL BUTTON */}
        {step === 'done' && (
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
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
