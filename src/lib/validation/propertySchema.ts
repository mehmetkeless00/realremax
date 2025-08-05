import { z } from 'zod';

// Base property schema
export const propertySchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .trim()
    .optional(),
  
  price: z
    .number()
    .min(1, 'Price must be greater than 0')
    .max(10000000, 'Price must be less than 10 million'),
  
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters')
    .trim(),
  
  type: z.enum(['apartment', 'house', 'condo', 'studio', 'townhouse', 'villa', 'penthouse', 'duplex', 'loft']),
  
  listing_type: z.enum(['sale', 'rent']),
  
  status: z.enum(['active', 'pending', 'sold', 'rented']).default('active'),
  
  bedrooms: z
    .number()
    .min(0, 'Bedrooms cannot be negative')
    .max(20, 'Bedrooms cannot exceed 20')
    .optional(),
  
  bathrooms: z
    .number()
    .min(0, 'Bathrooms cannot be negative')
    .max(20, 'Bathrooms cannot exceed 20')
    .optional(),
  
  size: z
    .number()
    .min(1, 'Size must be greater than 0')
    .max(10000, 'Size must be less than 10,000 sq ft')
    .optional(),
  
  year_built: z
    .number()
    .min(1900, 'Year built must be after 1900')
    .max(new Date().getFullYear(), 'Year built cannot be in the future')
    .optional(),
  
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters')
    .trim()
    .optional(),
  
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters')
    .trim()
    .optional(),
  
  postal_code: z
    .string()
    .regex(/^[A-Z0-9\s-]{3,10}$/i, 'Please enter a valid postal code')
    .trim()
    .optional(),
  
  country: z
    .string()
    .min(2, 'Country must be at least 2 characters')
    .max(50, 'Country must be less than 50 characters')
    .trim()
    .optional(),
  
  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .optional(),
  
  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .optional(),
  
  amenities: z
    .array(z.string())
    .max(20, 'Cannot select more than 20 amenities')
    .optional(),
  
  photos: z
    .array(z.string().url('Please provide valid image URLs'))
    .max(20, 'Cannot upload more than 20 photos')
    .optional(),
});

// Property search schema
export const propertySearchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query too long')
    .trim(),
  
  location: z
    .string()
    .max(100, 'Location too long')
    .trim()
    .optional(),
  
  minPrice: z
    .number()
    .min(0, 'Minimum price cannot be negative')
    .optional(),
  
  maxPrice: z
    .number()
    .min(0, 'Maximum price cannot be negative')
    .optional(),
  
  propertyType: z
    .enum(['apartment', 'house', 'condo', 'studio', 'townhouse', 'villa', 'penthouse', 'duplex', 'loft'])
    .optional(),
  
  listingType: z
    .enum(['sale', 'rent'])
    .optional(),
  
  minBedrooms: z
    .number()
    .min(0, 'Minimum bedrooms cannot be negative')
    .optional(),
  
  maxBedrooms: z
    .number()
    .min(0, 'Maximum bedrooms cannot be negative')
    .optional(),
  
  minBathrooms: z
    .number()
    .min(0, 'Minimum bathrooms cannot be negative')
    .optional(),
  
  maxBathrooms: z
    .number()
    .min(0, 'Maximum bathrooms cannot be negative')
    .optional(),
  
  minSize: z
    .number()
    .min(0, 'Minimum size cannot be negative')
    .optional(),
  
  maxSize: z
    .number()
    .min(0, 'Maximum size cannot be negative')
    .optional(),
});

// Property inquiry schema
export const propertyInquirySchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .trim(),
  
  email: z
    .string()
    .email('Please enter a valid email address')
    .trim(),
  
  phone: z
    .string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .trim()
    .optional(),
  
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .trim(),
  
  preferredContact: z
    .enum(['email', 'phone', 'both'])
    .default('email'),
  
  urgency: z
    .enum(['low', 'medium', 'high'])
    .default('medium'),
});

// Property update schema (partial)
export const propertyUpdateSchema = propertySchema.partial();

// Property filter schema
export const propertyFilterSchema = z.object({
  priceRange: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  }).optional(),
  
  location: z
    .string()
    .max(100)
    .trim()
    .optional(),
  
  propertyTypes: z
    .array(z.enum(['apartment', 'house', 'condo', 'studio', 'townhouse', 'villa', 'penthouse', 'duplex', 'loft']))
    .optional(),
  
  listingTypes: z
    .array(z.enum(['sale', 'rent']))
    .optional(),
  
  bedrooms: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  }).optional(),
  
  bathrooms: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  }).optional(),
  
  size: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  }).optional(),
  
  amenities: z
    .array(z.string())
    .optional(),
  
  yearBuilt: z.object({
    min: z.number().min(1900).optional(),
    max: z.number().max(new Date().getFullYear()).optional(),
  }).optional(),
});

// Type exports
export type PropertyInput = z.infer<typeof propertySchema>;
export type PropertySearchInput = z.infer<typeof propertySearchSchema>;
export type PropertyInquiryInput = z.infer<typeof propertyInquirySchema>;
export type PropertyUpdateInput = z.infer<typeof propertyUpdateSchema>;
export type PropertyFilterInput = z.infer<typeof propertyFilterSchema>;

// Validation helpers
export const validateProperty = (data: unknown): PropertyInput => {
  return propertySchema.parse(data);
};

export const validatePropertySearch = (data: unknown): PropertySearchInput => {
  return propertySearchSchema.parse(data);
};

export const validatePropertyInquiry = (data: unknown): PropertyInquiryInput => {
  return propertyInquirySchema.parse(data);
};

export const validatePropertyUpdate = (data: unknown): PropertyUpdateInput => {
  return propertyUpdateSchema.parse(data);
};

export const validatePropertyFilter = (data: unknown): PropertyFilterInput => {
  return propertyFilterSchema.parse(data);
};

// Safe validation helpers (returns success/error instead of throwing)
export const safeValidateProperty = (data: unknown) => {
  try {
    return { success: true, data: propertySchema.parse(data) };
  } catch (error) {
    return { success: false, error: error as z.ZodError };
  }
};

export const safeValidatePropertySearch = (data: unknown) => {
  try {
    return { success: true, data: propertySearchSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error as z.ZodError };
  }
};

export const safeValidatePropertyInquiry = (data: unknown) => {
  try {
    return { success: true, data: propertyInquirySchema.parse(data) };
  } catch (error) {
    return { success: false, error: error as z.ZodError };
  }
};
