import { Property, Resident, ChatMessage, ChatResponse } from '../shared/types';

describe('Type Definitions', () => {
  describe('Property', () => {
    it('should create valid property object', () => {
      const property: Property = {
        propertyId: 'PROP-001',
        address: {
          street: '123 Test Street',
          city: 'Test City',
          county: 'Test County',
          postcode: 'TEST123',
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
          billsIncluded: ['water']
        },
        availability: {
          status: 'available',
          availableFrom: new Date('2025-08-01'),
          tenancyTerms: ['12 months AST']
        },
        amenities: ['gym', 'garden'],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(property.propertyId).toBe('PROP-001');
      expect(property.type).toBe('flat');
      expect(property.details.bedrooms).toBe(2);
      expect(property.rent.monthlyAmount).toBe(1800);
      expect(property.availability.status).toBe('available');
    });
  });

  describe('Resident', () => {
    it('should create valid resident object', () => {
      const resident: Resident = {
        residentId: 'RES-001',
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          mobile: '+44 7700 900123',
          dateOfBirth: new Date('1990-01-01')
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
          name: 'Jane Doe',
          relationship: 'spouse',
          mobile: '+44 7700 900124'
        },
        documents: [],
        notes: ['Good tenant'],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(resident.residentId).toBe('RES-001');
      expect(resident.personalInfo.firstName).toBe('John');
      expect(resident.currentTenancy.status).toBe('active');
    });
  });

  describe('ChatMessage', () => {
    it('should create valid chat message', () => {
      const message: ChatMessage = {
        message: 'Hello, AI assistant!',
        timestamp: new Date().toISOString(),
        userId: 'user-123'
      };

      expect(message.message).toBe('Hello, AI assistant!');
      expect(typeof message.timestamp).toBe('string');
      expect(message.userId).toBe('user-123');
    });
  });

  describe('ChatResponse', () => {
    it('should create valid chat response', () => {
      const response: ChatResponse = {
        message: 'Hello! How can I help you?',
        timestamp: new Date().toISOString(),
        type: 'ai'
      };

      expect(response.message).toBe('Hello! How can I help you?');
      expect(response.type).toBe('ai');
      expect(typeof response.timestamp).toBe('string');
    });
  });
});
