import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Clipboard,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';
import { getOpenAI, DEFAULT_MODEL, DEFAULT_TEMPERATURE, DEFAULT_MAX_TOKENS } from '../config/openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  NotesList: undefined;
  Editor: { noteId?: string };
  Settings: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

interface ChatBotProps {
  isVisible: boolean;
  onClose: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ isVisible, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const savedMessages = await AsyncStorage.getItem('chatHistory');
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    loadChatHistory();
  }, []);

  useEffect(() => {
    const saveChatHistory = async () => {
      try {
        await AsyncStorage.setItem('chatHistory', JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    };

    saveChatHistory();
  }, [messages]);

  const clearChatHistory = async () => {
    try {
      await AsyncStorage.removeItem('chatHistory');
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Debug: Check if API key exists
      const apiKey = await AsyncStorage.getItem('openai_api_key');
      console.log('API Key exists:', !!apiKey);
      
      const openai = await getOpenAI();
      const chatMessages: ChatCompletionMessageParam[] = [
        { role: 'system', content: 'You are a helpful assistant.' },
        ...messages.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text,
        } as ChatCompletionMessageParam)),
        { role: 'user', content: inputText },
      ];

      console.log('Sending request to OpenAI...');
      const completion = await openai.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: chatMessages,
        temperature: DEFAULT_TEMPERATURE,
        max_tokens: DEFAULT_MAX_TOKENS,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: completion.choices[0].message.content || 'Sorry, I couldn\'t generate a response.',
        isUser: false,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      let errorText = 'Sorry, there was an error processing your request.';
      
      if (error instanceof Error) {
        if (error.message.includes('OpenAI API key not found')) {
          errorText = 'Please set your OpenAI API key in the settings to use the chatbot.';
          // Add a button to navigate to settings
          const settingsButton: Message = {
            id: (Date.now() + 2).toString(),
            text: 'Go to Settings',
            isUser: false,
          };
          setMessages(prev => [...prev, settingsButton]);
        } else if (error.message.includes('Connection error') || error.message.includes('Failed to connect')) {
          errorText = 'Unable to connect to the AI service. Please check your internet connection and try again.';
          // Add a retry button
          const retryButton: Message = {
            id: (Date.now() + 2).toString(),
            text: 'Retry',
            isUser: false,
          };
          setMessages(prev => [...prev, retryButton]);
        } else {
          errorText = error.message;
        }
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, messageId: string) => {
    Clipboard.setString(text);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000); // Reset after 2 seconds
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.botMessage,
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
      {!item.isUser && item.text === 'Go to Settings' ? (
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.settingsButtonText}>Open Settings</Text>
        </TouchableOpacity>
      ) : !item.isUser && item.text === 'Retry' ? (
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => handleSend()}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      ) : !item.isUser && (
        <TouchableOpacity 
          style={[
            styles.copyButton,
            copiedMessageId === item.id && styles.copyButtonActive
          ]}
          onPress={() => copyToClipboard(item.text, item.id)}
        >
          <Ionicons 
            name={copiedMessageId === item.id ? "checkmark" : "copy-outline"} 
            size={16} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      )}
    </View>
  );

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ask H.A.L</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearChatHistory}
          >
            <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          multiline
          returnKeyType="send"
          blurOnSubmit={false}
          onSubmitEditing={() => {
            if (inputText.trim() && !isLoading) {
              handleSend();
            }
          }}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Ionicons name="send" size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '33%',
    backgroundColor: 'rgba(0, 0, 51, 0.8)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  title: {
    ...globalStyles.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  messagesContainer: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    position: 'relative',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0, 122, 255, 0.6)',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingRight: 36, // Make room for the copy button
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  copyButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
  },
  copyButtonActive: {
    backgroundColor: 'rgba(0, 200, 0, 0.6)',
    opacity: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    color: '#FFFFFF',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
  },
  settingsButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.6)',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  retryButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.6)',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
}); 