export type SuccessResponseType<T, V> = {
  statusCode: number;
  message: string;
  data: T;
  other: V;
};

export type ErrorResponseType = {
  statusCode: number;
  message: string;
  // timestamp: string;
  // path: string;
  errorCode: string;
};

export type Pagination<T> = {
  metadata: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
  data: T[];
};

// ================== Customer =====================
// List of common currencies
export const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "VND", name: "Vietnamese Dong" }
];

// List of common timezones
export const timezones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Ho_Chi_Minh",
  "Australia/Sydney"
];

// List of common countries
export const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "Singapore",
  "Vietnam"
];
