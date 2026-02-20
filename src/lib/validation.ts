import { z } from "zod";

// Post creation validation schema
export const postSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  body: z.string()
    .min(1, "Content is required")
    .max(5000, "Content must be less than 5000 characters"),
  slug: z.string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly (lowercase letters, numbers, and hyphens only)"),
  photo_url: z.string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  tags: z.array(z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Tag name is required")
  }))
    .max(5, "You can select up to 5 tags")
});

// User registration validation schema
export const registerSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string()
    .email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  first_name: z.string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  last_name: z.string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
});

// User login validation schema
export const loginSchema = z.object({
  identifier: z.string()
    .min(1, "Username or email is required"),
  password: z.string()
    .min(1, "Password is required")
});

// Chat message validation schema
export const chatMessageSchema = z.object({
  content: z.string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message must be less than 1000 characters")
});

// Comment validation schema
export const commentSchema = z.object({
  text: z.string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment must be less than 500 characters")
});

// Duplicate holdings validation schema
export const duplicateHoldingSchema = z.object({
  fromMonth: z.number().int().min(1).max(12),
  fromYear: z.number().int().min(1900).max(2100),
  toMonth: z.number().int().min(1).max(12),
  toYear: z.number().int().min(1900).max(2100),
  overwrite: z.boolean().optional().default(false),
});

// Add/update holding form validation schema
export const holdingFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  platform: z.string().min(1, "Platform is required"),
  holding_type_id: z.union([z.string().min(1), z.number()]),
  currency: z.string().min(1, "Currency is required"),
  invested_amount: z.union([
    z.string().min(1, "Invested amount is required"),
    z.number(),
  ]),
  current_value: z.union([
    z.string().min(1, "Current value is required"),
    z.number(),
  ]),
  month: z.union([z.string().min(1, "Month is required"), z.number()]),
  year: z.union([z.string().min(1, "Year is required"), z.number()]),
  units: z.string().optional(),
  avg_buy_price: z.string().optional(),
  current_price: z.string().optional(),
  notes: z.string().optional(),
});

// Export types
export type PostFormData = z.infer<typeof postSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ChatMessageFormData = z.infer<typeof chatMessageSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
export type DuplicateHoldingPayload = z.infer<typeof duplicateHoldingSchema>;
export type HoldingFormData = z.infer<typeof holdingFormSchema>;
