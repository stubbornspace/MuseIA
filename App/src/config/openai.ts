import OpenAI from 'openai';
import AsyncStorage from '@react-native-async-storage/async-storage';

let openaiInstance: OpenAI | null = null;

export const getOpenAI = async () => {
  if (openaiInstance) {
    return openaiInstance;
  }

  const apiKey = await AsyncStorage.getItem('openai_api_key');
  console.log('Retrieved API key from storage:', apiKey ? 'exists' : 'missing');
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please set it in the settings.');
  }

  try {
    openaiInstance = new OpenAI({
      apiKey,
      timeout: 30000, // 30 second timeout
      maxRetries: 3, // Add retries for connection issues
      dangerouslyAllowBrowser: true, // Required for React Native
      baseURL: 'https://api.openai.com/v1', // Explicitly set the base URL
    });

    // Test the connection
    try {
      await openaiInstance.models.list();
      console.log('OpenAI connection test successful');
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to connect to OpenAI: ${error.message}`);
      }
      throw new Error('Failed to connect to OpenAI. Please check your internet connection and API key.');
    }

    return openaiInstance;
  } catch (error) {
    console.error('Error creating OpenAI instance:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to initialize OpenAI client: ${error.message}`);
    }
    throw new Error('Failed to initialize OpenAI client. Please check your API key and try again.');
  }
};

export const DEFAULT_MODEL = 'gpt-3.5-turbo';
export const DEFAULT_TEMPERATURE = 0.7;
export const DEFAULT_MAX_TOKENS = 150; 