import { MongoClient, Db, Collection } from 'mongodb';
import { config } from '../server/config';
import { logger } from '../shared/logger';
import { Property, Resident } from '../shared/types';

/**
 * MongoDB MCP Server
 * Provides database operations for property and resident management
 */
export class MongoDBMCPServer {
  private client: MongoClient;
  private db: Db | null = null;

  constructor() {
    this.client = new MongoClient(config.mongodb.uri);
  }

  /**
   * Connect to MongoDB
   */
  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db(config.mongodb.dbName);
      logger.info('Connected to MongoDB');
    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect(): Promise<void> {
    try {
      await this.client.close();
      logger.info('Disconnected from MongoDB');
    } catch (error) {
      logger.error('Error disconnecting from MongoDB:', error);
    }
  }

  /**
   * Get properties collection
   */
  private getPropertiesCollection(): Collection<Property> {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db.collection<Property>('properties');
  }

  /**
   * Get residents collection
   */
  private getResidentsCollection(): Collection<Resident> {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db.collection<Resident>('residents');
  }

  /**
   * Search properties by filters
   */
  async searchProperties(filters: any): Promise<Property[]> {
    try {
      const collection = this.getPropertiesCollection();
      const query = this.buildPropertyQuery(filters);
      const properties = await collection.find(query).toArray();
      logger.info(`Found ${properties.length} properties`);
      return properties;
    } catch (error) {
      logger.error('Error searching properties:', error);
      throw error;
    }
  }

  /**
   * Get property by ID
   */
  async getProperty(propertyId: string): Promise<Property | null> {
    try {
      const collection = this.getPropertiesCollection();
      const property = await collection.findOne({ propertyId });
      logger.info(`Retrieved property: ${propertyId}`);
      return property;
    } catch (error) {
      logger.error('Error getting property:', error);
      throw error;
    }
  }

  /**
   * Create new property
   */
  async createProperty(propertyData: Omit<Property, '_id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
    try {
      const collection = this.getPropertiesCollection();
      const newProperty: Property = {
        ...propertyData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await collection.insertOne(newProperty);
      newProperty._id = result.insertedId.toString();
      logger.info(`Created property: ${newProperty.propertyId}`);
      return newProperty;
    } catch (error) {
      logger.error('Error creating property:', error);
      throw error;
    }
  }

  /**
   * Find resident by property ID
   */
  async getResidentByProperty(propertyId: string): Promise<Resident | null> {
    try {
      const collection = this.getResidentsCollection();
      const resident = await collection.findOne({ 
        'currentTenancy.propertyId': propertyId,
        'currentTenancy.status': 'active'
      });
      logger.info(`Retrieved resident for property: ${propertyId}`);
      return resident;
    } catch (error) {
      logger.error('Error getting resident by property:', error);
      throw error;
    }
  }

  /**
   * Build MongoDB query from filters
   */
  private buildPropertyQuery(filters: any): any {
    const query: any = {};

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.bedrooms) {
      query['details.bedrooms'] = filters.bedrooms;
    }

    if (filters.maxRent) {
      query['rent.monthlyAmount'] = { $lte: filters.maxRent };
    }

    if (filters.minRent) {
      query['rent.monthlyAmount'] = { 
        ...query['rent.monthlyAmount'], 
        $gte: filters.minRent 
      };
    }

    if (filters.status) {
      query['availability.status'] = filters.status;
    }

    if (filters.city) {
      query['address.city'] = new RegExp(filters.city, 'i');
    }

    return query;
  }
}

/**
 * Start the MCP server
 */
async function startMCPServer() {
  const mcpServer = new MongoDBMCPServer();
  
  try {
    await mcpServer.connect();
    logger.info('MCP Server started successfully');
    
    // Keep the server running
    process.on('SIGINT', async () => {
      logger.info('Shutting down MCP Server...');
      await mcpServer.disconnect();
      process.exit(0);
    });
    
  } catch (error) {
    logger.error('Failed to start MCP Server:', error);
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startMCPServer();
}
