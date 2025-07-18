import { MongoClient, Db, Collection } from 'mongodb';
import { config } from '../server/config';
import { logger } from '../shared/logger';
import { Property, Resident, MCPRequest, MCPResponse } from '../shared/types';

/**
 * MongoDB MCP Server
 * Handles database operations for property management
 */
export class MongoMCPServer {
  private client: MongoClient;
  private db!: Db;
  private propertiesCollection!: Collection<Property>;
  private residentsCollection!: Collection<Resident>;
  private isConnected = false;

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
      this.propertiesCollection = this.db.collection<Property>('properties');
      this.residentsCollection = this.db.collection<Resident>('residents');
      this.isConnected = true;
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
    if (this.isConnected) {
      await this.client.close();
      this.isConnected = false;
      logger.info('Disconnected from MongoDB');
    }
  }

  /**
   * Process MCP request
   */
  async processRequest(request: MCPRequest): Promise<MCPResponse> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      let response: MCPResponse;

      switch (request.method) {
        case 'properties.search':
          response = await this.searchProperties(request.params);
          break;
        case 'properties.create':
          response = await this.createProperty(request.params);
          break;
        case 'properties.update':
          response = await this.updateProperty(request.params);
          break;
        case 'properties.delete':
          response = await this.deleteProperty(request.params);
          break;
        case 'residents.search':
          response = await this.searchResidents(request.params);
          break;
        case 'residents.create':
          response = await this.createResident(request.params);
          break;
        case 'residents.update':
          response = await this.updateResident(request.params);
          break;
        case 'residents.delete':
          response = await this.deleteResident(request.params);
          break;
        default:
          return {
            error: {
              code: -32601,
              message: `Method not found: ${request.method}`
            },
            id: request.id
          };
      }

      // Ensure the response includes the request ID
      response.id = request.id;
      return response;
    } catch (error) {
      logger.error('Error processing MCP request:', error);
      return {
        error: {
          code: -32603,
          message: 'Internal error',
          data: error
        },
        id: request.id
      };
    }
  }

  /**
   * Search properties with filters
   */
  private async searchProperties(params: any): Promise<MCPResponse> {
    const {
      bedrooms,
      maxRent,
      minRent,
      type,
      status,
      city,
      petsAllowed,
      furnished,
      limit = 10,
      skip = 0
    } = params;

    const filter: any = {};

    if (bedrooms) filter['details.bedrooms'] = bedrooms;
    if (maxRent) filter['rent.monthlyAmount'] = { $lte: maxRent };
    if (minRent) filter['rent.monthlyAmount'] = { ...filter['rent.monthlyAmount'], $gte: minRent };
    if (type) filter.type = type;
    if (status) filter['availability.status'] = status;
    if (city) filter['address.city'] = new RegExp(city, 'i');
    if (petsAllowed !== undefined) filter['details.petsAllowed'] = petsAllowed;
    if (furnished !== undefined) filter['details.furnished'] = furnished;

    const properties = await this.propertiesCollection
      .find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .toArray();

    return {
      result: {
        properties,
        count: properties.length,
        total: await this.propertiesCollection.countDocuments(filter)
      }
    };
  }
  /**
   * Create a new property
   */
  private async createProperty(params: any): Promise<MCPResponse> {
    const property: Property = {
      ...params,
      propertyId: params.propertyId || `PROP-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await this.propertiesCollection.insertOne(property);
    
    return {
      result: {
        propertyId: property.propertyId,
        _id: result.insertedId,
        success: true
      }
    };
  }

  /**
   * Update a property
   */
  private async updateProperty(params: any): Promise<MCPResponse> {
    const { propertyId, ...updateData } = params;
    updateData.updatedAt = new Date();

    const result = await this.propertiesCollection.updateOne(
      { propertyId },
      { $set: updateData }
    );

    return {
      result: {
        propertyId,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        success: result.matchedCount > 0
      }
    };
  }

  /**
   * Delete a property
   */
  private async deleteProperty(params: any): Promise<MCPResponse> {
    const { propertyId } = params;
    
    const result = await this.propertiesCollection.deleteOne({ propertyId });
    
    return {
      result: {
        propertyId,
        deletedCount: result.deletedCount,
        success: result.deletedCount > 0
      }
    };
  }

  /**
   * Search residents
   */
  private async searchResidents(params: any): Promise<MCPResponse> {
    const {
      propertyId,
      status,
      firstName,
      lastName,
      email,
      limit = 10,
      skip = 0
    } = params;

    const filter: any = {};

    if (propertyId) filter['currentTenancy.propertyId'] = propertyId;
    if (status) filter['currentTenancy.status'] = status;
    if (firstName) filter['personalInfo.firstName'] = new RegExp(firstName, 'i');
    if (lastName) filter['personalInfo.lastName'] = new RegExp(lastName, 'i');
    if (email) filter['personalInfo.email'] = new RegExp(email, 'i');

    const residents = await this.residentsCollection
      .find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .toArray();

    return {
      result: {
        residents,
        count: residents.length,
        total: await this.residentsCollection.countDocuments(filter)
      }
    };
  }

  /**
   * Create a new resident
   */
  private async createResident(params: any): Promise<MCPResponse> {
    const resident: Resident = {
      ...params,
      residentId: params.residentId || `RES-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await this.residentsCollection.insertOne(resident);
    
    return {
      result: {
        residentId: resident.residentId,
        _id: result.insertedId,
        success: true
      }
    };
  }

  /**
   * Update a resident
   */
  private async updateResident(params: any): Promise<MCPResponse> {
    const { residentId, ...updateData } = params;
    updateData.updatedAt = new Date();

    const result = await this.residentsCollection.updateOne(
      { residentId },
      { $set: updateData }
    );

    return {
      result: {
        residentId,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        success: result.matchedCount > 0
      }
    };
  }

  /**
   * Delete a resident
   */
  private async deleteResident(params: any): Promise<MCPResponse> {
    const { residentId } = params;
    
    const result = await this.residentsCollection.deleteOne({ residentId });
    
    return {
      result: {
        residentId,
        deletedCount: result.deletedCount,
        success: result.deletedCount > 0
      }
    };
  }

  /**
   * Initialize sample data (for development)
   */
  async initializeSampleData(): Promise<void> {
    const propertiesCount = await this.propertiesCollection.countDocuments();
    const residentsCount = await this.residentsCollection.countDocuments();

    if (propertiesCount === 0) {
      logger.info('Initializing sample properties...');
      await this.createSampleProperties();
    }

    if (residentsCount === 0) {
      logger.info('Initializing sample residents...');
      await this.createSampleResidents();
    }
  }

  private async createSampleProperties(): Promise<void> {
    const sampleProperties: Property[] = [
      {
        propertyId: 'PROP-001',
        address: {
          street: '123 High Street',
          city: 'Manchester',
          county: 'Greater Manchester',
          postcode: 'M1 2AB',
          country: 'UK'
        },
        type: 'flat',
        details: {
          bedrooms: 2,
          bathrooms: 1,
          receptionRooms: 1,
          squareMetres: 75,
          furnished: false,
          petsAllowed: true,
          parking: 'allocated space'
        },
        rent: {
          monthlyAmount: 1800,
          currency: 'GBP',
          deposit: 2700,
          billsIncluded: ['water', 'council tax']
        },
        availability: {
          status: 'available',
          availableFrom: new Date('2025-08-01'),
          tenancyTerms: ['12 months AST', '6 months short let']
        },
        amenities: ['communal garden', 'gym', 'concierge', 'balcony'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        propertyId: 'PROP-002',
        address: {
          street: '456 Kings Road',
          city: 'London',
          county: 'Greater London',
          postcode: 'SW3 4TZ',
          country: 'UK'
        },
        type: 'flat',
        details: {
          bedrooms: 2,
          bathrooms: 1,
          receptionRooms: 1,
          squareMetres: 68,
          furnished: true,
          petsAllowed: false,
          parking: 'none'
        },
        rent: {
          monthlyAmount: 1950,
          currency: 'GBP',
          deposit: 2925,
          billsIncluded: ['water']
        },
        availability: {
          status: 'available',
          availableFrom: new Date('2025-07-15'),
          tenancyTerms: ['12 months AST']
        },
        amenities: ['communal garden', 'gym', 'concierge'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        propertyId: 'PROP-003',
        address: {
          street: '789 Castle Street',
          city: 'Edinburgh',
          county: 'Edinburgh',
          postcode: 'EH1 2NG',
          country: 'UK'
        },
        type: 'flat',
        details: {
          bedrooms: 2,
          bathrooms: 1,
          receptionRooms: 1,
          squareMetres: 82,
          furnished: false,
          petsAllowed: true,
          parking: 'street parking'
        },
        rent: {
          monthlyAmount: 1650,
          currency: 'GBP',
          deposit: 2475,
          billsIncluded: ['water', 'heating']
        },
        availability: {
          status: 'available',
          availableFrom: new Date('2025-07-15'),
          tenancyTerms: ['12 months AST', '6 months short let']
        },
        amenities: ['washing machine included', 'close to transport'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await this.propertiesCollection.insertMany(sampleProperties);
    logger.info(`Inserted ${sampleProperties.length} sample properties`);
  }

  private async createSampleResidents(): Promise<void> {
    const sampleResidents: Resident[] = [
      {
        residentId: 'RES-001',
        personalInfo: {
          firstName: 'James',
          lastName: 'Wilson',
          email: 'james.wilson@email.co.uk',
          mobile: '+44 7700 900123',
          dateOfBirth: new Date('1990-05-15')
        },
        currentTenancy: {
          propertyId: 'PROP-001',
          tenancyStart: new Date('2025-01-01'),
          tenancyEnd: new Date('2025-12-31'),
          monthlyRent: 1800,
          deposit: 2700,
          status: 'active',
          tenancyType: 'AST'
        },
        emergencyContact: {
          name: 'Sarah Wilson',
          relationship: 'partner',
          mobile: '+44 7700 900124'
        },
        documents: [
          {
            type: 'tenancy_agreement',
            url: '/documents/tenancy_001.pdf',
            uploadedAt: new Date()
          },
          {
            type: 'right_to_rent',
            url: '/documents/rtr_001.pdf',
            uploadedAt: new Date()
          }
        ],
        notes: ['Excellent tenant', 'Always pays rent on time', 'Very tidy'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await this.residentsCollection.insertMany(sampleResidents);
    logger.info(`Inserted ${sampleResidents.length} sample residents`);
  }
}
