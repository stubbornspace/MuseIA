import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NotesProvider } from './src/context/NotesContext';
import { AudioProvider } from './src/context/AudioContext';
import { ChatBotProvider } from './src/context/ChatBotContext';
import { NotesListScreen } from './src/screens/NotesListScreen';
import { EditorScreen } from './src/screens/EditorScreen';
import { StatusBar } from 'expo-status-bar';
import { MusicButton } from './src/components/MusicButton';
import { ChatButton } from './src/components/ChatButton';
import { ChatBot } from './src/components/ChatBot';
import { View, StyleSheet } from 'react-native';
import { useChatBot } from './src/context/ChatBotContext';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { isChatBotVisible, toggleChatBot } = useChatBot();

  return (
    <View style={styles.container}>
      {isChatBotVisible && <ChatBot isVisible={isChatBotVisible} onClose={toggleChatBot} />}
      <View style={styles.mainContent}>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
            }}
          >
            <Stack.Screen name="NotesList" component={NotesListScreen} />
            <Stack.Screen name="Editor" component={EditorScreen} />
          </Stack.Navigator>
          <MusicButton />
          <ChatButton />
        </NavigationContainer>
      </View>
    </View>
  );
};

export default function App() {
  return (
    <AudioProvider>
      <NotesProvider>
        <ChatBotProvider>
          <AppContent />
        </ChatBotProvider>
      </NotesProvider>
    </AudioProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
  },
});
