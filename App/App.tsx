import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NotesProvider } from './src/context/NotesContext';
import { AudioProvider } from './src/context/AudioContext';
import { ChatBotProvider } from './src/context/ChatBotContext';
import { BackgroundProvider } from './src/context/BackgroundContext';
import { NotesListScreen } from './src/screens/NotesListScreen';
import { EditorScreen } from './src/screens/EditorScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
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
      <NavigationContainer>
        <View style={styles.mainContent}>
          {isChatBotVisible && <ChatBot isVisible={isChatBotVisible} onClose={toggleChatBot} />}
          <View style={styles.content}>
            <StatusBar style="light" />
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
              }}
            >
              <Stack.Screen name="NotesList" component={NotesListScreen} />
              <Stack.Screen name="Editor" component={EditorScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
            <MusicButton />
            <ChatButton />
          </View>
        </View>
      </NavigationContainer>
    </View>
  );
};

export default function App() {
  return (
    <BackgroundProvider>
      <NotesProvider>
        <AudioProvider>
          <ChatBotProvider>
            <AppContent />
          </ChatBotProvider>
        </AudioProvider>
      </NotesProvider>
    </BackgroundProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
});
