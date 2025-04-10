import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ImageBackground } from 'react-native';
import { useNotes } from '../context/NotesContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Note } from '../types/note';
import { globalStyles } from '../styles/globalStyles';
import { SaveNoteModal } from '../components/SaveNoteModal';
import { MenuButton } from '../components/MenuButton';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  NotesList: undefined;
  Editor: { noteId?: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type EditorScreenRouteProp = RouteProp<RootStackParamList, 'Editor'>;
type IconName = keyof typeof Ionicons.glyphMap;

export const EditorScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<EditorScreenRouteProp>();
  const noteId = route.params?.noteId;
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  useEffect(() => {
    if (noteId) {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        setContent(note.content);
        setCurrentNote(note);
        setIsEditing(true);
      }
    }
  }, [noteId, notes]);

  const handleSave = (title: string, tag: string) => {
    if (isEditing && noteId) {
      updateNote(noteId, { title, content, tag });
    } else {
      addNote({ title, content, tag });
    }
    setIsSaveModalVisible(false);
    navigation.goBack();
  };

  const handleDelete = () => {
    if (noteId) {
      deleteNote(noteId);
      navigation.goBack();
    }
  };

  const menuActions = [
    {
      label: 'Save',
      onPress: () => setIsSaveModalVisible(true),
      icon: 'save-outline' as IconName,
    },
    {
      label: 'Delete',
      onPress: handleDelete,
      icon: 'trash-outline' as IconName,
    },
    {
      label: 'Home',
      onPress: () => navigation.navigate('NotesList'),
      icon: 'home-outline' as IconName,
    },
  ];

  return (
    <ImageBackground 
      source={require('../../assets/space.jpg')} 
      style={globalStyles.container}
    >
      <MenuButton actions={menuActions} />
      
      <TextInput
        style={[globalStyles.text, styles.contentInput]}
        placeholder="Start writing..."
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
      />

      <SaveNoteModal
        visible={isSaveModalVisible}
        onSave={handleSave}
        onCancel={() => setIsSaveModalVisible(false)}
        initialTitle={currentNote?.title}
        initialTag={currentNote?.tag}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  contentInput: {
    flex: 1,
    lineHeight: 24,
    marginTop: 80,
    marginBottom: 80,
    maxWidth: 800,
    marginHorizontal: 'auto',
  },
}); 