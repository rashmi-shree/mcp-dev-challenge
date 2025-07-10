/**
 * Shared types for the MCP Dev Challenge application
 */

// Message types for Socket.IO communication
export interface ChatMessage {
  message: string;
  timestamp: string;
  userId?: string;
}

export interface ChatResponse {
  message: string;
  timestamp: string;
  type: 'ai' | 'system' | 'error';
}

// Property management types
export interface Property {
  _id?: string;
  propertyId: string;
  address: Address;
  type: PropertyType;
  details: PropertyDetails;
  rent: RentInfo;
  availability: AvailabilityInfo;
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
}

export type PropertyType = 'flat' | 'house' | 'maisonette' | 'studio';

export interface PropertyDetails {
  bedrooms: number;
  bathrooms: number;
  receptionRooms: number;
  squareMetres: number;
  furnished: boolean;
  petsAllowed: boolean;
  parking: string;
}

export interface RentInfo {
  monthlyAmount: number;
  currency: string;
  deposit: number;
  billsIncluded: string[];
}

export interface AvailabilityInfo {
  status: 'available' | 'let' | 'maintenance';
  availableFrom: Date;
  tenancyTerms: string[];
}

// Resident types
export interface Resident {
  _id?: string;
  residentId: string;
  personalInfo: PersonalInfo;
  currentTenancy: TenancyInfo;
  emergencyContact: EmergencyContact;
  documents: Document[];
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dateOfBirth: Date;
}

export interface TenancyInfo {
  propertyId: string;
  tenancyStart: Date;
  tenancyEnd: Date;
  monthlyRent: number;
  deposit: number;
  status: 'active' | 'expired' | 'terminated';
  tenancyType: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  mobile: string;
}

export interface Document {
  type: string;
  url: string;
  uploadedAt: Date;
}

// MCP protocol types
export interface MCPRequest {
  method: string;
  params?: any;
  id?: string;
}

export interface MCPResponse {
  result?: any;
  error?: MCPError;
  id?: string;
}

export interface MCPError {
  code: number;
  message: string;
  data?: any;
}
