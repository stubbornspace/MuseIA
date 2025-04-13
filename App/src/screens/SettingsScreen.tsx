import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import { useBackground } from '../context/BackgroundContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const BACKGROUND_IMAGES = [
  { id: 'space', name: 'Space', source: require('../../assets/bgs/space.jpg') },
  { id: 'space1', name: 'Space 1', source: require('../../assets/bgs/space1.jpg') },
  { id: 'space2', name: 'Space 2', source: require('../../assets/bgs/space2.jpg') },
  { id: 'space3', name: 'Space 3', source: require('../../assets/bgs/space3.jpg') },
];

export const SettingsScreen = () => {
  const navigation = useNavigation();
  const { backgroundImage, setBackgroundImage } = useBackground();
  const [selectedBackground, setSelectedBackground] = useState('space');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedBackground = await AsyncStorage.getItem('background_image');
      if (savedBackground) {
        setSelectedBackground(savedBackground);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
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