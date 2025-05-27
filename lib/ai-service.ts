import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import Constants from 'expo-constants';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: Constants.expoConfig?.extra?.openaiApiKey,
});

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: Constants.expoConfig?.extra?.anthropicApiKey,
});

export type AIChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type AIChatResponse = {
  message: string;
  error?: string;
};

export async function getAIResponse(
  messages: AIChatMessage[],
  provider: 'openai' | 'anthropic' = 'openai'
): Promise<AIChatResponse> {
  try {
    if (provider === 'openai') {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: 0.7,
      });

      return {
        message: response.choices[0]?.message?.content || 'No response from AI',
      };
    } else {
      try {
        // Filter out system messages for Anthropic as it doesn't support them
        const anthropicMessages = messages
          .filter(msg => msg.role !== 'system')
          .map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          }));

        const response = await anthropic.messages.create({
          model: 'claude-3-opus-20240229',
          max_tokens: 1000,
          messages: anthropicMessages,
          temperature: 0.7,
        });

        return {
          message: response.content[0]?.type === 'text' ? response.content[0].text : 'No response from AI',
        };
      } catch (anthropicError: any) {
        // If Anthropic fails, fallback to OpenAI
        console.warn('Anthropic API failed, falling back to OpenAI:', anthropicError);
        const response = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          temperature: 0.7,
        });

        return {
          message: response.choices[0]?.message?.content || 'No response from AI',
        };
      }
    }
  } catch (error: any) {
    console.error('AI Service Error:', error);
    let errorMessage = 'Unable to get AI response. ';
    
    if (error?.response?.data?.error?.message) {
      errorMessage += error.response.data.error.message;
    } else if (error?.message) {
      errorMessage += error.message;
    } else {
      errorMessage += 'Please try again later.';
    }

    return {
      message: '',
      error: errorMessage,
    };
  }
} 