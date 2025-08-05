import { z } from 'zod';

// User registration schema
export const userRegistrationSchema = z
  .object({
    email: z
      .string()
      .email('Please enter a valid email address')
      .max(100, 'Email must be less than 100 characters')
      .trim(),
    
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
    
    role: z.enum(['registered', 'agent']).default('registered'),
    
    phone: z
      .string()
      .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
      .trim()
      .optional(),
    
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, 'You must agree to the terms and conditions'),
    
    marketingEmails: z
      .boolean()
      .default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// User login schema
export const userLoginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .trim(),
  
  password: z
    .string()
    .min(1, 'Password is required'),
  
  rememberMe: z
    .boolean()
    .default(false),
});

// Password reset request schema
export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .trim(),
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
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .trim()
    .optional(),
  
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .trim()
    .optional(),
  
  avatar: z
    .string()
    .url('Must be a valid URL')
    .optional(),
  
  preferences: z.object({
    emailNotifications: z.boolean().default(true),
    smsNotifications: z.boolean().default(false),
    marketingEmails: z.boolean().default(false),
    language: z.enum(['en', 'tr', 'nl']).default('en'),
    currency: z.enum(['USD', 'EUR', 'TRY']).default('EUR'),
  }).optional(),
});

// Agent profile schema
export const agentProfileSchema = z.object({
  licenseNumber: z
    .string()
    .min(5, 'License number must be at least 5 characters')
    .max(50, 'License number must be less than 50 characters')
    .trim(),
  
  company: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters')
    .trim(),
  
  experience: z
    .number()
    .min(0, 'Experience cannot be negative')
    .max(50, 'Experience cannot exceed 50 years')
    .optional(),
  
  specializations: z
    .array(z.string())
    .max(10, 'Cannot select more than 10 specializations')
    .optional(),
  
  languages: z
    .array(z.enum(['en', 'tr', 'nl', 'de', 'fr', 'es']))
    .min(1, 'At least one language must be selected')
    .max(5, 'Cannot select more than 5 languages'),
  
  serviceAreas: z
    .array(z.string())
    .min(1, 'At least one service area must be selected')
    .max(20, 'Cannot select more than 20 service areas'),
  
  commission: z
    .number()
    .min(0, 'Commission cannot be negative')
    .max(100, 'Commission cannot exceed 100%')
    .optional(),
});

// Password change schema
export const passwordChangeSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required'),
    
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must be less than 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

// Email verification schema
export const emailVerificationSchema = z.object({
  token: z
    .string()
    .min(1, 'Verification token is required'),
});

// Two-factor authentication schema
export const twoFactorAuthSchema = z.object({
  code: z
    .string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d{6}$/, 'Verification code must contain only digits'),
});

// Social login schema
export const socialLoginSchema = z.object({
  provider: z.enum(['google', 'facebook', 'apple']),
  token: z.string().min(1, 'Access token is required'),
});

// Type exports
export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type NewPasswordInput = z.infer<typeof newPasswordSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type AgentProfileInput = z.infer<typeof agentProfileSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
export type EmailVerificationInput = z.infer<typeof emailVerificationSchema>;
export type TwoFactorAuthInput = z.infer<typeof twoFactorAuthSchema>;
export type SocialLoginInput = z.infer<typeof socialLoginSchema>;

// Validation helpers
export const validateUserRegistration = (data: unknown): UserRegistrationInput => {
  return userRegistrationSchema.parse(data);
};

export const validateUserLogin = (data: unknown): UserLoginInput => {
  return userLoginSchema.parse(data);
};

export const validatePasswordResetRequest = (data: unknown): PasswordResetRequestInput => {
  return passwordResetRequestSchema.parse(data);
};

export const validateNewPassword = (data: unknown): NewPasswordInput => {
  return newPasswordSchema.parse(data);
};

export const validateProfileUpdate = (data: unknown): ProfileUpdateInput => {
  return profileUpdateSchema.parse(data);
};

export const validateAgentProfile = (data: unknown): AgentProfileInput => {
  return agentProfileSchema.parse(data);
};

export const validatePasswordChange = (data: unknown): PasswordChangeInput => {
  return passwordChangeSchema.parse(data);
};

export const validateEmailVerification = (data: unknown): EmailVerificationInput => {
  return emailVerificationSchema.parse(data);
};

export const validateTwoFactorAuth = (data: unknown): TwoFactorAuthInput => {
  return twoFactorAuthSchema.parse(data);
};

export const validateSocialLogin = (data: unknown): SocialLoginInput => {
  return socialLoginSchema.parse(data);
};

// Safe validation helpers (returns success/error instead of throwing)
export const safeValidateUserRegistration = (data: unknown) => {
  try {
    return { success: true, data: userRegistrationSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error as z.ZodError };
  }
};

export const safeValidateUserLogin = (data: unknown) => {
  try {
    return { success: true, data: userLoginSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error as z.ZodError };
  }
};

export const safeValidatePasswordResetRequest = (data: unknown) => {
  try {
    return { success: true, data: passwordResetRequestSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error as z.ZodError };
  }
};

export const safeValidateNewPassword = (data: unknown) => {
  try {
    return { success: true, data: newPasswordSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error as z.ZodError };
  }
};

export const safeValidateProfileUpdate = (data: unknown) => {
  try {
    return { success: true, data: profileUpdateSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error as z.ZodError };
  }
};

export const safeValidateAgentProfile = (data: unknown) => {
  try {
    return { success: true, data: agentProfileSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error as z.ZodError };
  }
}; 