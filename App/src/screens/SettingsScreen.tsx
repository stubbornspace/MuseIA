import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useBackground } from '../context/BackgroundContext';

const BACKGROUND_IMAGES = [
  { id: 'space', name: 'Space', source: require('../../assets/bgs/space.jpg') },
  { id: 'space1', name: 'Space 1', source: require('../../assets/bgs/space1.jpg') },
  { id: 'space2', name: 'Space 2', source: require('../../assets/bgs/space2.jpg') },
  { id: 'space3', name: 'Space 3', source: require('../../assets/bgs/space3.jpg') },
];

export const SettingsScreen = () => {
  const navigation = useNavigation();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { backgroundImage, setBackgroundImage } = useBackground();
  const [selectedBackground, setSelectedBackground] = useState('space');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [savedKey, savedBackground] = await Promise.all([
        AsyncStorage.getItem('openai_api_key'),
        AsyncStorage.getItem('background_image'),
      ]);
      if (savedKey) {
        setApiKey(savedKey);
      }
      if (savedBackground) {
        setSelectedBackground(savedBackground);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = async () => {
    try {
      await AsyncStorage.setItem('openai_api_key', apiKey);
      Alert.alert('Success', 'API key saved successfully');
    } catch (error) {
      console.error('Error saving API key:', error);
      Alert.alert('Error', 'Failed to save API key');
    }
  };

  const clearApiKey = async () => {
    try {
      await AsyncStorage.removeItem('openai_api_key');
      setApiKey('');
      Alert.alert('Success', 'API key cleared');
    } catch (error) {
      console.error('Error clearing API key:', error);
      Alert.alert('Error', 'Failed to clear API key');
    }
  };

  const handleBackgroundSelect = async (backgroundId: string) => {
    try {
      await setBackgroundImage(backgroundId);
      setSelectedBackground(backgroundId);
      Alert.alert('Success', 'Background image updated');
    } catch (error) {
      console.error('Error saving background:', error);
      Alert.alert('Error', 'Failed to save background selection');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OpenAI API Key</Text>
          <Text style={styles.description}>
            Enter your OpenAI API key to enable the AI chat functionality.
            Your key is stored securely on your device.
          </Text>
          
          <TextInput
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="Enter your OpenAI API key"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            secureTextEntry
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={saveApiKey}
            >
              <Text style={styles.buttonText}>Save API Key</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={clearApiKey}
            >
              <Text style={styles.buttonText}>Clear API Key</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Background Image</Text>
          <Text style={styles.description}>
            Choose your preferred background image for the app.
          </Text>
          
          <View style={styles.backgroundGrid}>
            {BACKGROUND_IMAGES.map((bg) => (
              <TouchableOpacity
                key={bg.id}
                style={[
                  styles.backgroundItem,
                  selectedBackground === bg.id && styles.selectedBackground,
                ]}
                onPress={() => handleBackgroundSelect(bg.id)}
              >
                <Image source={bg.source} style={styles.backgroundImage} />
                <Text style={styles.backgroundLabel}>{bg.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    ...globalStyles.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...globalStyles.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    ...globalStyles.text,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
  },
  input: {
    ...globalStyles.text,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  saveButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.6)',
  },
  clearButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
  },
  buttonText: {
    ...globalStyles.text,
    fontWeight: 'bold',
  },
  backgroundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  backgroundItem: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBackground: {
    borderColor: '#007AFF',
  },
  backgroundImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  backgroundLabel: {
    ...globalStyles.text,
    textAlign: 'center',
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
}); 