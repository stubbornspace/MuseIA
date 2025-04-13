import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNotes } from '../context/NotesContext';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { Note } from '../types/note';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { globalStyles } from '../styles/globalStyles';
import { MenuButton } from '../components/MenuButton';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBackground } from '../context/BackgroundContext';

type RootStackParamList = {
  NotesList: undefined;
  Editor: { noteId?: string };
  Settings: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type IconName = keyof typeof Ionicons.glyphMap;

const BACKGROUND_IMAGES = {
  space: require('../../assets/bgs/space.jpg'),
  space1: require('../../assets/bgs/space1.jpg'),
  space2: require('../../assets/bgs/space2.jpg'),
  space3: require('../../assets/bgs/space3.jpg'),
};

export const NotesListScreen = () => {
  const { notes } = useNotes();
  const navigation = useNavigation<NavigationProp>();
  const { backgroundImage } = useBackground();

  const menuActions = [
    {
      label: 'New Note',
      onPress: () => navigation.navigate('Editor', { noteId: undefined }),
      icon: 'add-circle-outline' as IconName,
    },
    {
      label: 'Settings',
      onPress: () => navigation.navigate('Settings'),
      icon: 'settings-outline' as IconName,
    },
  ];

  const renderNoteItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={styles.noteItem}
      onPress={() => navigation.navigate('Editor', { noteId: item.id })}
    >
      <Text style={[globalStyles.text, styles.noteTitle]} numberOfLines={1}>
        {item.title || 'Untitled Note'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground 
      source={backgroundImage}
      style={globalStyles.container}
    >
      <MenuButton actions={menuActions} />
      <FlatList
        data={notes}
        renderItem={renderNoteItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteItem: {
    width: '100%',
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  noteTitle: {
    textAlign: 'center',
  },
}); 