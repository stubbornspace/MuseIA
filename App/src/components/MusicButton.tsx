import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';
import { useAudio } from '../context/AudioContext';

export const MusicButton: React.FC = () => {
  const { isPlaying, togglePlayback } = useAudio();

  return (
    <TouchableOpacity 
      style={[globalStyles.button, styles.musicButton]} 
      onPress={togglePlayback}
    >
      <Ionicons 
        name={isPlaying ? 'pause-circle-outline' : 'play-circle-outline'} 
        size={24} 
        color="#FFFFFF" 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  musicButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(50, 50, 50, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    right: 30,
    zIndex: 1000,
  },
}); 