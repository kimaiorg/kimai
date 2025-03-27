/**
 * Test utilities for handling TypeScript errors with Jest matchers
 */

/**
 * Helper function to avoid TypeScript errors with Jest matchers
 * This allows using matchers like toBeInTheDocument, toHaveBeenCalled, etc.
 * without TypeScript complaining about missing type definitions
 */
export const expectAny = (actual: any) => expect(actual) as any;
