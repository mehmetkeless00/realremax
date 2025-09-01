import { z } from 'zod';

// Base property schema
export const propertySchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  price: z
    .number()
    .min(0, 'Price must be positive')
    .max(10000000, 'Price must be less than 10 million'),
  currency: z.enum(['EUR', 'USD', 'TRY']),
  type: z.enum([
    'apartment',
    'house',
    'villa',
    'studio',
    'land',
    'office',
    'store',
  ]),
  operation: z.enum(['buy', 'rent']),
  status: z.enum(['active', 'pending', 'sold', 'rented']),

  // Location
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  district: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),

  // Property details
  bedrooms: z.number().min(0).max(20).optional(),
  bathrooms: z.number().min(0).max(20).optional(),
  size: z.number().min(1, 'Size must be at least 1 m²').optional(),
  year_built: z.number().min(1800).max(new Date().getFullYear()).optional(),
  energy_rating: z.enum(['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G']).optional(),

  // Amenities
  amenities: z.array(z.string()),

  // Media
  photos: z.array(z.string().url('Invalid photo URL')),

  // Agent info (for listings)
  agent_id: z.string().uuid().optional(),
});

// Property creation schema (for new listings)
export const createPropertySchema = propertySchema;

// Property update schema
export const updatePropertySchema = propertySchema.partial().extend({
  id: z.string().uuid().optional(),
});

// Property search/filter schema
export const propertySearchSchema = z.object({
  mode: z.enum(['buy', 'rent']).optional(),
  type: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  price_min: z.number().min(0).optional(),
  price_max: z.number().min(0).optional(),
  beds_min: z.number().min(0).optional(),
  size_min: z.number().min(0).optional(),
  size_max: z.number().min(0).optional(),
  sort: z.enum(['recent', 'price_asc', 'price_desc']).default('recent'),
  page: z.number().min(1).default(1),
  per: z.number().min(1).max(100).default(12),
  recent_days: z.number().min(1).optional(),
});

// Property inquiry schema
export const propertyInquirySchema = z.object({
  property_id: z.string().uuid(),
  agent_id: z.string().uuid(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 characters').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Property favorite schema
export const propertyFavoriteSchema = z.object({
  property_id: z.string().uuid(),
});

// Type exports
export type Property = z.infer<typeof propertySchema>;
export type CreateProperty = z.infer<typeof createPropertySchema>;
export type UpdateProperty = z.infer<typeof updatePropertySchema>;
export type PropertySearch = z.infer<typeof propertySearchSchema>;
export type PropertyInquiry = z.infer<typeof propertyInquirySchema>;
export type PropertyFavorite = z.infer<typeof propertyFavoriteSchema>;
