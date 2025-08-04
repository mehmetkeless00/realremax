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
    .max(10000000, 'Price must be less than 10,000,000'),

  location: z
    .string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters')
    .trim(),

  type: z.enum(['apartment', 'house', 'villa', 'commercial', 'land']),

  bedrooms: z
    .number()
    .min(0, 'Bedrooms cannot be negative')
    .max(20, 'Bedrooms cannot exceed 20')
    .optional(),

  bathrooms: z
    .number()
    .min(0, 'Bathrooms cannot be negative')
    .max(10, 'Bathrooms cannot exceed 10')
    .optional(),

  size: z
    .number()
    .min(1, 'Size must be greater than 0')
    .max(10000, 'Size must be less than 10,000 sq ft')
    .optional(),

  year_built: z
    .number()
    .min(1800, 'Year built must be after 1800')
    .max(new Date().getFullYear() + 1, 'Year built cannot be in the future')
    .optional(),

  status: z.enum(['active', 'pending', 'sold', 'rented']),

  listing_type: z.enum(['sale', 'rent']),

  amenities: z
    .array(z.string())
    .max(20, 'Cannot have more than 20 amenities')
    .optional(),

  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters')
    .trim(),

  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters')
    .trim(),

  postal_code: z
    .string()
    .min(4, 'Postal code must be at least 4 characters')
    .max(10, 'Postal code must be less than 10 characters')
    .trim(),

  country: z
    .string()
    .min(2, 'Country must be at least 2 characters')
    .max(50, 'Country must be less than 50 characters')
    .trim(),

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

  images: z
    .array(z.string().url('Must be a valid URL'))
    .max(10, 'Cannot upload more than 10 images')
    .optional(),
});

// Property update schema (all fields optional)
export const propertyUpdateSchema = propertySchema.partial();

// Property search schema
export const propertySearchSchema = z.object({
  location: z.string().optional(),
  type: z
    .enum(['apartment', 'house', 'villa', 'commercial', 'land'])
    .optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  bedrooms: z.number().min(0).optional(),
  listing_type: z.enum(['sale', 'rent']).optional(),
  status: z.enum(['active', 'pending', 'sold', 'rented']).optional(),
});

// Property inquiry schema
export const inquirySchema = z.object({
  propertyId: z.string().uuid('Invalid property ID'),
  agentId: z.string().uuid('Invalid agent ID'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),

  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 digits')
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional(),

  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .trim(),
});

// User registration schema
export const userRegistrationSchema = z
  .object({
    email: z
      .string()
      .email('Please enter a valid email address')
      .max(100, 'Email must be less than 100 characters'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must be less than 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),

    confirmPassword: z.string(),

    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .trim(),

    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .trim(),

    role: z.enum(['user', 'agent', 'admin']).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// User login schema
export const userLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Password reset schema
export const passwordResetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// New password schema
export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must be less than 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Profile update schema
export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .trim(),

  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .trim(),

  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 digits')
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional(),

  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .trim()
    .optional(),

  avatar: z.string().url('Must be a valid URL').optional(),
});

// Contact form schema
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),

  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters')
    .trim(),

  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters')
    .trim(),
});

// Type exports
export type PropertyInput = z.infer<typeof propertySchema>;
export type PropertyUpdateInput = z.infer<typeof propertyUpdateSchema>;
export type PropertySearchInput = z.infer<typeof propertySearchSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type NewPasswordInput = z.infer<typeof newPasswordSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
