import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NotesProvider } from './src/context/NotesContext';
import { AudioProvider } from './src/context/AudioContext';
import { NotesListScreen } from './src/screens/NotesListScreen';
import { EditorScreen } from './src/screens/EditorScreen';
import { StatusBar } from 'expo-status-bar';
import { MenuButton } from './src/components/MenuButton';
import { MusicButton } from './src/components/MusicButton';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AudioProvider>
      <NotesProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#ffffff' },
            }}
          >
            <Stack.Screen name="NotesList" component={NotesListScreen} />
            <Stack.Screen name="Editor" component={EditorScreen} />
          </Stack.Navigator>
          <MusicButton />
        </NavigationContainer>
      </NotesProvider>
    </AudioProvider>
  );
}
