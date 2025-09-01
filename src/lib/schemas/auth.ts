import { z } from 'zod';

// Sign up schema
export const signUpSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string(),
    role: z.enum(['registered', 'agent']).default('registered'),
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .optional(),
    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .optional(),
    phone: z
      .string()
      .min(10, 'Phone must be at least 10 characters')
      .optional(),
    agreeToTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        'You must agree to the terms and conditions'
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Sign in schema
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Reset password schema
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  });

// Profile update schema
export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .optional(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .optional(),
  phone: z.string().min(10, 'Phone must be at least 10 characters').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  preferences: z
    .object({
      emailNotifications: z.boolean().default(true),
      smsNotifications: z.boolean().default(false),
      newsletter: z.boolean().default(true),
    })
    .optional(),
});

// Agent profile schema
export const agentProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  company: z.string().min(2, 'Company must be at least 2 characters'),
  license_number: z
    .string()
    .min(5, 'License number must be at least 5 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  specialties: z.array(z.string()).default([]),
  experience_years: z.number().min(0).max(50).optional(),
  languages: z.array(z.string()).default(['English']),
  photo: z.string().url('Invalid photo URL').optional(),
});

// Type exports
export type SignUp = z.infer<typeof signUpSchema>;
export type SignIn = z.infer<typeof signInSchema>;
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
export type AgentProfile = z.infer<typeof agentProfileSchema>;
