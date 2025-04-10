import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';
import { useChatBot } from '../context/ChatBotContext';

export const ChatButton: React.FC = () => {
  const { isChatBotVisible, toggleChatBot } = useChatBot();

  return (
    <TouchableOpacity 
      style={[globalStyles.button, styles.chatButton]} 
      onPress={toggleChatBot}
    >
      <Ionicons 
        name={isChatBotVisible ? "close-circle-outline" : "chatbubble-outline"} 
        size={24} 
        color="#FFFFFF" 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(50, 50, 50, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 30,
    zIndex: 1000,
  },
}); 