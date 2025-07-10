import OpenAI from 'openai';
import { config } from '../server/config';
import { logger } from '../shared/logger';

/**
 * AI Assistant - MCP Client
 * Integrates with OpenAI API and MCP servers to provide intelligent responses
 */
export class AIAssistant {
  private openai: OpenAI;
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  /**
   * Process a user message and generate a response
   */
  async processMessage(message: string): Promise<string> {
    try {
      // Add user message to conversation history
      this.conversationHistory.push({ role: 'user', content: message });

      // TODO: Implement MCP server integration here
      // For now, we'll use OpenAI directly
      
      const response = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant for a property management system. 
                     You can help users with property searches, tenant information, and general inquiries.
                     Be friendly, professional, and concise in your responses.`
          },
          ...this.conversationHistory
        ],
        max_tokens: config.openai.maxTokens,
        temperature: 0.7,
      });

      const aiResponse = response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
      
      // Add AI response to conversation history
      this.conversationHistory.push({ role: 'assistant', content: aiResponse });

      // Keep conversation history manageable (last 10 exchanges)
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      logger.info('AI response generated successfully');
      return aiResponse;

    } catch (error) {
      logger.error('Error processing message:', error);
      return 'Sorry, I encountered an error while processing your message. Please try again.';
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
    logger.info('Conversation history cleared');
  }
}
