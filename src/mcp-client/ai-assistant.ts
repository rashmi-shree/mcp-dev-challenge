import OpenAI from 'openai';
import { config } from '../server/config';
import { logger } from '../shared/logger';
import { MCPClient } from './mcp-client';

/**
 * AI Assistant - MCP Client
 * 
 * Integrates with OpenAI API and MCP servers to provide intelligent responses
 * for property management queries. This class handles:
 * - Natural language processing and intent recognition
 * - OpenAI API communication with context management
 * - MCP (Model Context Protocol) integration for database operations
 * - Conversation history and memory management
 */
export class AIAssistant {
  private openai: OpenAI;
  private mcpClient: MCPClient;
  private conversationHistory: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [];
  private isInitialized = false;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
    this.mcpClient = new MCPClient();
  }

  /**
   * Initialize the AI Assistant
   */
  async initialize(): Promise<void> {
    if (!this.isInitialized) {
      await this.mcpClient.initialize();
      this.isInitialized = true;
      logger.info('AI Assistant initialized successfully');
    }
  }

  /**
   * Process a user message and generate a response
   */
  async processMessage(message: string): Promise<string> {
    try {
      // Initialize if not already done
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Add user message to conversation history
      this.conversationHistory.push({ role: 'user', content: message });

      // Analyze user intent and determine if MCP interaction is needed
      const intent = await this.analyzeIntent(message);
      
      let contextData = '';
      if (intent.requiresMCP) {
        contextData = await this.handleMCPInteraction(intent);
      }

      // Generate response using OpenAI with context
      const response = await this.generateResponse(message, contextData);
      
      // Add AI response to conversation history
      this.conversationHistory.push({ role: 'assistant', content: response });

      // Keep conversation history manageable (last 20 exchanges)
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      logger.info('AI response generated successfully');
      return response;

    } catch (error) {
      logger.error('Error processing message:', error);
      return 'Sorry, I encountered an error while processing your message. Please try again.';
    }
  }

  /**
   * Analyze user intent to determine required actions
   */
  private async analyzeIntent(message: string): Promise<any> {
    const lowerMessage = message.toLowerCase();
    
    // Property search patterns
    if (lowerMessage.includes('search') || lowerMessage.includes('find') || 
        lowerMessage.includes('show') || lowerMessage.includes('list')) {
      if (lowerMessage.includes('property') || lowerMessage.includes('flat') || 
          lowerMessage.includes('house') || lowerMessage.includes('bedroom')) {
        return {
          requiresMCP: true,
          action: 'search_properties',
          filters: this.extractPropertyFilters(message)
        };
      }
      
      if (lowerMessage.includes('tenant') || lowerMessage.includes('resident')) {
        return {
          requiresMCP: true,
          action: 'search_residents',
          filters: this.extractResidentFilters(message)
        };
      }
    }

    // Property creation patterns
    if (lowerMessage.includes('add') || lowerMessage.includes('create') || 
        lowerMessage.includes('new property')) {
      return {
        requiresMCP: true,
        action: 'create_property',
        data: this.extractPropertyData(message)
      };
    }

    // Tenant lookup patterns
    if (lowerMessage.includes('who is') || lowerMessage.includes('current tenant') || 
        lowerMessage.includes('tenant of')) {
      return {
        requiresMCP: true,
        action: 'find_tenant',
        filters: this.extractTenantLookupFilters(message)
      };
    }

    return {
      requiresMCP: false,
      action: 'general_chat'
    };
  }

  /**
   * Extract property search filters from user message
   */
  private extractPropertyFilters(message: string): any {
    const filters: any = {};
    
    // Extract bedrooms
    const bedroomMatch = message.match(/(\d+)\s*bedroom/i);
    if (bedroomMatch && bedroomMatch[1]) {
      filters.bedrooms = parseInt(bedroomMatch[1]);
    }

    // Extract price range
    const priceMatch = message.match(/under\s*£?(\d+)/i);
    if (priceMatch && priceMatch[1]) {
      filters.maxRent = parseInt(priceMatch[1]);
    }

    const minPriceMatch = message.match(/over\s*£?(\d+)/i);
    if (minPriceMatch && minPriceMatch[1]) {
      filters.minRent = parseInt(minPriceMatch[1]);
    }

    // Extract property type
    if (message.toLowerCase().includes('flat')) filters.type = 'flat';
    if (message.toLowerCase().includes('house')) filters.type = 'house';
    if (message.toLowerCase().includes('studio')) filters.type = 'studio';

    // Extract location
    const cityMatch = message.match(/in\s+([A-Za-z\s]+)/i);
    if (cityMatch && cityMatch[1]) {
      filters.city = cityMatch[1].trim();
    }

    // Extract status
    filters.status = 'available'; // Default to available properties

    return filters;
  }

  /**
   * Extract resident search filters from user message
   */
  private extractResidentFilters(message: string): any {
    const filters: any = {};
    
    // Extract property ID
    const propMatch = message.match(/PROP-(\d+)/i);
    if (propMatch && propMatch[1]) {
      filters.propertyId = `PROP-${propMatch[1]}`;
    }

    // Extract name
    const nameMatch = message.match(/named?\s+([A-Za-z\s]+)/i);
    if (nameMatch && nameMatch[1]) {
      const name = nameMatch[1].trim();
      filters.firstName = name.split(' ')[0];
      if (name.split(' ').length > 1) {
        filters.lastName = name.split(' ')[1];
      }
    }

    return filters;
  }

  /**
   * Extract tenant lookup filters from user message
   */
  private extractTenantLookupFilters(message: string): any {
    const filters: any = {};
    
    // Extract property ID
    const propMatch = message.match(/PROP-(\d+)/i);
    if (propMatch && propMatch[1]) {
      filters.propertyId = `PROP-${propMatch[1]}`;
    }

    filters.status = 'active'; // Only active tenants

    return filters;
  }

  /**
   * Extract property data for creation
   */
  private extractPropertyData(message: string): any {
    const data: any = {};
    
    // Extract address
    const addressMatch = message.match(/at\s+([^,]+)/i);
    if (addressMatch && addressMatch[1]) {
      data.address = {
        street: addressMatch[1].trim(),
        city: 'Unknown',
        county: 'Unknown',
        postcode: 'Unknown',
        country: 'UK'
      };
    }

    // Extract bedrooms
    const bedroomMatch = message.match(/(\d+)\s*bedroom/i);
    if (bedroomMatch && bedroomMatch[1]) {
      data.details = {
        bedrooms: parseInt(bedroomMatch[1]),
        bathrooms: 1,
        receptionRooms: 1,
        squareMetres: 50,
        furnished: false,
        petsAllowed: false,
        parking: 'none'
      };
    }

    // Extract rent
    const rentMatch = message.match(/£(\d+)/i);
    if (rentMatch && rentMatch[1]) {
      const monthlyAmount = parseInt(rentMatch[1]);
      data.rent = {
        monthlyAmount,
        currency: 'GBP',
        deposit: monthlyAmount * 1.5,
        billsIncluded: []
      };
    }

    // Default values
    data.type = 'flat';
    data.availability = {
      status: 'available',
      availableFrom: new Date(),
      tenancyTerms: ['12 months AST']
    };
    data.amenities = [];

    return data;
  }

  /**
   * Handle MCP interactions based on intent
   */
  private async handleMCPInteraction(intent: any): Promise<string> {
    try {
      let response;
      
      switch (intent.action) {
        case 'search_properties':
          response = await this.mcpClient.searchProperties(intent.filters);
          break;
        case 'search_residents':
          response = await this.mcpClient.searchResidents(intent.filters);
          break;
        case 'create_property':
          response = await this.mcpClient.createProperty(intent.data);
          break;
        case 'find_tenant':
          response = await this.mcpClient.searchResidents(intent.filters);
          break;
        default:
          return '';
      }

      if (response.error) {
        logger.error('MCP interaction error:', response.error);
        return 'I encountered an error while accessing the property database.';
      }

      return JSON.stringify(response.result);
    } catch (error) {
      logger.error('Error in MCP interaction:', error);
      return 'I encountered an error while processing your request.';
    }
  }

  /**
   * Generate response using OpenAI with context
   */
  private async generateResponse(message: string, contextData: string): Promise<string> {
    const systemPrompt = `You are a helpful AI assistant for a property management system. 
You have access to a database of properties and residents through an MCP (Model Context Protocol) server.

When users ask about properties, residents, or related queries, use the provided context data to give accurate, helpful responses.

Context Data: ${contextData}

Guidelines:
- Be friendly, professional, and concise
- Format property information clearly with bullet points
- Include relevant details like property ID, address, rent, bedrooms, etc.
- If searching for properties, show the most relevant matches
- If no results found, suggest alternative searches
- For tenant information, respect privacy and only share appropriate details
- Always be helpful and suggest next steps when appropriate

Current conversation context: Property management assistant`;

    const response = await this.openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...this.conversationHistory.slice(-10),
        { role: 'user', content: message }
      ],
      max_tokens: config.openai.maxTokens,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
    logger.info('Conversation history cleared');
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    if (this.isInitialized) {
      await this.mcpClient.cleanup();
      this.isInitialized = false;
      logger.info('AI Assistant cleaned up');
    }
  }
}
