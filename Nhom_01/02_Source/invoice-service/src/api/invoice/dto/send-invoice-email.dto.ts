import { z } from 'zod';

// Define the schema for sender info
const senderInfoSchema = z.object({
  userId: z.union([z.number(), z.string()]).optional(),
  userName: z.string().optional(),
}).optional();

/**
 * Schema for validating invoice email sending requests
 * Supports empty objects and provides default values
 */
export const sendInvoiceEmailSchema = z.preprocess(
  // First preprocess to handle ANY input type
  (input) => {
    // If input is null, undefined, or not an object (like a number), convert to empty object
    if (input === null || input === undefined || typeof input !== 'object') {
      console.log('[VALIDATION] Converting non-object input to empty object:', input);
      return {};
    }
    return input;
  },
  // Then apply the schema to the sanitized input
  z.object({
    emailType: z.enum(['standard', 'update_notification']).optional().default('standard'),
    senderInfo: senderInfoSchema,
    email: z.string().email('Invalid email format').optional(),
  }).optional().transform(data => {
    // If data is undefined or empty object, return default values
    if (!data || Object.keys(data).length === 0) {
      return { emailType: 'standard' };
    }
    return data;
  })
);

// Export the DTO type - must match what the schema returns
export type SendInvoiceEmailDto = {
  emailType: 'standard' | 'update_notification';
  senderInfo?: {
    userId?: number | string;
    userName?: string;
  };
  email?: string;
};

// Type for the schema output
export type SendInvoiceEmailSchemaOutput = z.infer<typeof sendInvoiceEmailSchema>;

