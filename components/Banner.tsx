import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

type BannerProps = {
  name: string;
  age: number | string;
  gender: string;
  totalScore: number;
  onInfoPress: () => void;
};

export default function Banner({ name, age, gender, totalScore, onInfoPress }: BannerProps) {
  const emoji = gender === 'Female' ? '👩‍⚕️' : '👨‍⚕️';
  const title = gender === 'Female' ? 'Ms.' : 'Mr.';

  return (
    <View
      style={{
        backgroundColor: '#1C91F2',
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 16, color: '#fff' }}>
        {emoji} {title} {name} ({age} Y/O)
      </Text>
      <Pressable onPress={onInfoPress}>
        <View
          style={{
            backgroundColor: '#0288D1',
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 4,
            paddingHorizontal: 12,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fff', marginRight: 6 }}>
            {totalScore} Points
          </Text>
          <FontAwesomeIcon icon={faCircleInfo} size={16} color="#fff" />
        </View>
      </Pressable>
    </View>
  );
}
