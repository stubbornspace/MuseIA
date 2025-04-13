import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NotesProvider } from './src/context/NotesContext';
import { AudioProvider } from './src/context/AudioContext';
import { BackgroundProvider } from './src/context/BackgroundContext';
import { NotesListScreen } from './src/screens/NotesListScreen';
import { EditorScreen } from './src/screens/EditorScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { StatusBar } from 'expo-status-bar';
import { MusicButton } from './src/components/MusicButton';
import { View, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <View style={styles.mainContent}>
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
          <AppContent />
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
