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
  tags: z
    .array(z.string().min(1, "Tag name is required"))
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

// Add user (super admin) validation schema
export const addUserSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be less than 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    first_name: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be less than 50 characters"),
    last_name: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be less than 50 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Edit user (super admin) validation schema
export const editUserSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: z.string().email("Please enter a valid email address"),
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
    .max(10000, "Message must be less than 10000 characters")
});

// Comment validation schema
export const commentSchema = z.object({
  text: z.string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be less than 1000 characters")
});

// Duplicate holdings validation schema
export const duplicateHoldingSchema = z.object({
  fromMonth: z.number().int().min(1).max(12),
  fromYear: z.number().int().min(1900).max(2100),
  toMonth: z.number().int().min(1).max(12),
  toYear: z.number().int().min(1900).max(2100),
  overwrite: z.boolean().optional().default(false),
});

/** Max lengths for holdings form (Zod + optional `maxLength` on inputs). */
export const HOLDING_FORM_LIMITS = {
  nameMax: 200,
  symbolMax: 32,
  platformMax: 64,
  currencyMax: 10,
  notesMax: 2000,
  /** Max chars for stored money string (no commas). */
  moneyRawMax: 24,
  /** Max chars typed in money fields including thousand separators. */
  moneyInputDisplayMax: 40,
  moneyDecimalsMax: 8,
  optionalNumericRawMax: 24,
  optionalNumericDecimalsMax: 8,
  holdingTypeIdDigitsMax: 10,
} as const;

const decimalPattern = /^-?(?:\d+\.?\d*|\.\d+)$/;

function holdingRequiredDecimal(label: string) {
  return z
    .union([z.string(), z.number()])
    .transform((v) => (typeof v === "number" ? String(v) : v.trim()))
    .pipe(
      z
        .string()
        .min(1, `${label} is required`)
        .max(HOLDING_FORM_LIMITS.moneyRawMax, `${label} is too long`)
        .refine((s) => decimalPattern.test(s), {
          message: `${label} must be a valid number`,
        })
        .refine((s) => {
          const dot = s.indexOf(".");
          if (dot === -1) return true;
          return s.length - dot - 1 <= HOLDING_FORM_LIMITS.moneyDecimalsMax;
        }, {
          message: `${label} must have at most ${HOLDING_FORM_LIMITS.moneyDecimalsMax} decimal places`,
        })
        .refine((s) => Number.isFinite(Number(s)), {
          message: `${label} must be a valid number`,
        })
    );
}

function holdingOptionalDecimal(label: string) {
  return z
    .union([z.string(), z.number()])
    .transform((v) => (typeof v === "number" ? String(v) : v.trim()))
    .pipe(
      z
        .string()
        .max(
          HOLDING_FORM_LIMITS.optionalNumericRawMax,
          `${label} is too long`
        )
        .refine((s) => s === "" || decimalPattern.test(s), {
          message: `${label} must be a valid number`,
        })
        .refine((s) => {
          if (s === "") return true;
          const dot = s.indexOf(".");
          if (dot === -1) return true;
          return (
            s.length - dot - 1 <= HOLDING_FORM_LIMITS.optionalNumericDecimalsMax
          );
        }, {
          message: `${label} must have at most ${HOLDING_FORM_LIMITS.optionalNumericDecimalsMax} decimal places`,
        })
        .refine((s) => s === "" || Number.isFinite(Number(s)), {
          message: `${label} must be a valid number`,
        })
    );
}

// Add/update holding form validation schema
export const holdingFormSchema = z.object({
  name: z
    .string()
    .transform((s) => s.trim())
    .pipe(
      z
        .string()
        .min(1, "Name is required")
        .max(HOLDING_FORM_LIMITS.nameMax, `Name must be at most ${HOLDING_FORM_LIMITS.nameMax} characters`)
    ),
  symbol: z
    .string()
    .transform((s) => s.trim())
    .pipe(
      z
        .string()
        .max(
          HOLDING_FORM_LIMITS.symbolMax,
          `Symbol must be at most ${HOLDING_FORM_LIMITS.symbolMax} characters`
        )
    ),
  platform: z
    .string()
    .transform((s) => s.trim())
    .pipe(
      z
        .string()
        .min(1, "Platform is required")
        .max(
          HOLDING_FORM_LIMITS.platformMax,
          `Platform must be at most ${HOLDING_FORM_LIMITS.platformMax} characters`
        )
    ),
  holding_type_id: z
    .string()
    .transform((s) => s.trim())
    .refine((s) => /^\d+$/.test(s) && parseInt(s, 10) > 0, {
      message: "Please select a holding type",
    })
    .refine((s) => s.length <= HOLDING_FORM_LIMITS.holdingTypeIdDigitsMax, {
      message: "Invalid holding type",
    }),
  currency: z
    .string()
    .transform((s) => s.trim())
    .pipe(
      z
        .string()
        .min(1, "Currency is required")
        .max(
          HOLDING_FORM_LIMITS.currencyMax,
          `Currency must be at most ${HOLDING_FORM_LIMITS.currencyMax} characters`
        )
    ),
  invested_amount: holdingRequiredDecimal("Invested amount"),
  current_value: holdingRequiredDecimal("Current value"),
  month: z
    .union([z.string(), z.number()])
    .transform((v) => String(v).trim())
    .pipe(
      z
        .string()
        .min(1, "Month is required")
        .max(2, "Month is invalid")
        .refine((s) => /^\d{1,2}$/.test(s), "Month is invalid")
        .refine((s) => {
          const n = parseInt(s, 10);
          return n >= 1 && n <= 12;
        }, "Month must be between 1 and 12")
    ),
  year: z
    .union([z.string(), z.number()])
    .transform((v) => String(v).trim())
    .pipe(
      z
        .string()
        .min(1, "Year is required")
        .max(4, "Year is invalid")
        .refine((s) => /^\d{4}$/.test(s), "Year must be a 4-digit year")
        .refine((s) => {
          const n = parseInt(s, 10);
          return n >= 1900 && n <= 2100;
        }, "Year must be between 1900 and 2100")
    ),
  units: holdingOptionalDecimal("Units"),
  avg_buy_price: holdingOptionalDecimal("Average buy price"),
  current_price: holdingOptionalDecimal("Current price"),
  notes: z
    .string()
    .max(
      HOLDING_FORM_LIMITS.notesMax,
      `Notes must be at most ${HOLDING_FORM_LIMITS.notesMax} characters`
    ),
});

// Profile update validation schema
export const profileUpdateSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  last_name: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters"),
  email: z.string().email("Please enter a valid email address"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  phone: z.string().optional(),
  location: z.string().optional(),
});

// Password update validation schema
export const passwordUpdateSchema = z
  .object({
    old_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password must be less than 100 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

// Export types
export type PostFormData = z.infer<typeof postSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AddUserFormData = z.infer<typeof addUserSchema>;
export type EditUserFormData = z.infer<typeof editUserSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ChatMessageFormData = z.infer<typeof chatMessageSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
export type DuplicateHoldingPayload = z.infer<typeof duplicateHoldingSchema>;
export type HoldingFormData = z.infer<typeof holdingFormSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type PasswordUpdateFormData = z.infer<typeof passwordUpdateSchema>;

// Bookmark folder validation schema
export const bookmarkFolderSchema = z.object({
  name: z.string()
    .min(1, "Folder name is required")
    .max(100, "Folder name must be less than 100 characters"),
  description: z.string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
});

// Bookmark annotation/details validation schema
export const bookmarkSchema = z.object({
  name: z.string()
    .max(255, "Custom name must be less than 255 characters")
    .optional()
    .or(z.literal("")),
  notes: z.string()
    .max(2000, "Notes must be less than 2000 characters")
    .optional()
    .or(z.literal("")),
});

export type BookmarkFolderFormData = z.infer<typeof bookmarkFolderSchema>;
export type BookmarkFormData = z.infer<typeof bookmarkSchema>;
