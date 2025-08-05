import { z } from 'zod';

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
    .max(100, 'Email must be less than 100 characters')
    .trim(),
  
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
  
  phone: z
    .string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .trim()
    .optional(),
  
  preferredContact: z
    .enum(['email', 'phone', 'both'])
    .default('email'),
  
  urgency: z
    .enum(['low', 'medium', 'high'])
    .default('medium'),
  
  category: z
    .enum(['general', 'support', 'sales', 'technical', 'feedback'])
    .default('general'),
  
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, 'You must agree to the terms and conditions'),
  
  marketingConsent: z
    .boolean()
    .default(false),
});

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .trim(),
  
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .trim()
    .optional(),
  
  interests: z
    .array(z.enum(['buying', 'selling', 'renting', 'investing', 'market-updates']))
    .min(1, 'Please select at least one interest')
    .max(5, 'Cannot select more than 5 interests')
    .optional(),
  
  frequency: z
    .enum(['weekly', 'monthly', 'quarterly'])
    .default('monthly'),
  
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, 'You must agree to receive newsletters'),
});

// Feedback form schema
export const feedbackSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  
  email: z
    .string()
    .email('Please enter a valid email address')
    .trim(),
  
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  
  category: z
    .enum(['website', 'service', 'property', 'agent', 'general'])
    .default('general'),
  
  message: z
    .string()
    .min(10, 'Feedback must be at least 10 characters')
    .max(1000, 'Feedback must be less than 1000 characters')
    .trim(),
  
  allowContact: z
    .boolean()
    .default(false),
  
  anonymous: z
    .boolean()
    .default(false),
});

// Support ticket schema
export const supportTicketSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .trim(),
  
  category: z
    .enum(['technical', 'billing', 'account', 'property', 'general'])
    .default('general'),
  
  priority: z
    .enum(['low', 'medium', 'high', 'urgent'])
    .default('medium'),
  
  attachments: z
    .array(z.string().url('Please provide valid file URLs'))
    .max(5, 'Cannot upload more than 5 files')
    .optional(),
  
  contactInfo: z.object({
    name: z.string().min(2).max(100).trim(),
    email: z.string().email().trim(),
    phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/).trim().optional(),
  }),
});

// Property valuation request schema
export const valuationRequestSchema = z.object({
  propertyAddress: z
    .string()
    .min(10, 'Property address must be at least 10 characters')
    .max(300, 'Property address must be less than 300 characters')
    .trim(),
  
  propertyType: z
    .enum(['apartment', 'house', 'condo', 'studio', 'townhouse', 'villa', 'penthouse', 'duplex', 'loft']),
  
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
  
  yearBuilt: z
    .number()
    .min(1900, 'Year built must be after 1900')
    .max(new Date().getFullYear(), 'Year built cannot be in the future')
    .optional(),
  
  currentValue: z
    .number()
    .min(0, 'Current value cannot be negative')
    .optional(),
  
  reason: z
    .enum(['selling', 'refinancing', 'insurance', 'tax', 'curiosity'])
    .default('selling'),
  
  timeline: z
    .enum(['immediate', '1-3-months', '3-6-months', '6-12-months', 'no-rush'])
    .default('no-rush'),
  
  contactInfo: z.object({
    name: z.string().min(2).max(100).trim(),
    email: z.string().email().trim(),
    phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/).trim(),
  }),
  
  additionalNotes: z
    .string()
    .max(500, 'Additional notes must be less than 500 characters')
    .trim()
    .optional(),
  
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, 'You must agree to the terms and conditions'),
  
  marketingConsent: z
    .boolean()
    .default(false),
});

// File upload schema
export const fileUploadSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, 'At least one file must be selected')
    .max(10, 'Cannot upload more than 10 files'),
  
  allowedTypes: z
    .array(z.string())
    .default(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  
  maxSize: z
    .number()
    .default(5 * 1024 * 1024), // 5MB default
  
  category: z
    .enum(['property', 'document', 'avatar', 'general'])
    .default('general'),
});

// Search form schema
export const searchFormSchema = z.object({
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
  
  filters: z.object({
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().min(0).optional(),
    propertyType: z.enum(['apartment', 'house', 'condo', 'studio', 'townhouse', 'villa', 'penthouse', 'duplex', 'loft']).optional(),
    listingType: z.enum(['sale', 'rent']).optional(),
    minBedrooms: z.number().min(0).optional(),
    maxBedrooms: z.number().min(0).optional(),
    minBathrooms: z.number().min(0).optional(),
    maxBathrooms: z.number().min(0).optional(),
    minSize: z.number().min(0).optional(),
    maxSize: z.number().min(0).optional(),
  }).optional(),
  
  sortBy: z
    .enum(['price-asc', 'price-desc', 'date-newest', 'date-oldest', 'relevance'])
    .default('relevance'),
  
  viewMode: z
    .enum(['grid', 'list', 'map'])
    .default('grid'),
});

// Type exports
export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type SupportTicketInput = z.infer<typeof supportTicketSchema>;
export type ValuationRequestInput = z.infer<typeof valuationRequestSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type SearchFormInput = z.infer<typeof searchFormSchema>;

// Validation helpers
export const validateContact = (data: unknown): ContactInput => {
  return contactSchema.parse(data);
};

export const validateNewsletter = (data: unknown): NewsletterInput => {
  return newsletterSchema.parse(data);
};

export const validateFeedback = (data: unknown): FeedbackInput => {
  return feedbackSchema.parse(data);
};

export const validateSupportTicket = (data: unknown): SupportTicketInput => {
  return supportTicketSchema.parse(data);
};

export const validateValuationRequest = (data: unknown): ValuationRequestInput => {
  return valuationRequestSchema.parse(data);
};

export const validateFileUpload = (data: unknown): FileUploadInput => {
  return fileUploadSchema.parse(data);
};

export const validateSearchForm = (data: unknown): SearchFormInput => {
  return searchFormSchema.parse(data);
};

// Safe validation helpers
export const safeValidateContact = (data: unknown) => {
  try {
    return { success: true, data: contactSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error as z.ZodError };
  }
};

export const safeValidateNewsletter = (data: unknown) => {
  try {
    return { success: true, data: newsletterSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error as z.ZodError };
  }
};

export const safeValidateFeedback = (data: unknown) => {
  try {
    return { success: true, data: feedbackSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error as z.ZodError };
  }
};

export const safeValidateSupportTicket = (data: unknown) => {
  try {
    return { success: true, data: supportTicketSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error as z.ZodError };
  }
};

export const safeValidateValuationRequest = (data: unknown) => {
  try {
    return { success: true, data: valuationRequestSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error as z.ZodError };
  }
};

export const safeValidateFileUpload = (data: unknown) => {
  try {
    return { success: true, data: fileUploadSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error as z.ZodError };
  }
};

export const safeValidateSearchForm = (data: unknown) => {
  try {
    return { success: true, data: searchFormSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error as z.ZodError };
  }
}; 