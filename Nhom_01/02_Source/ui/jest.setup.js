import "@testing-library/jest-dom";

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, "sessionStorage", {
  value: mockSessionStorage
});

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: "/en/dashboard"
  }),
  usePathname: () => "/en/dashboard",
  useParams: () => ({ locale: "en" }),
  notFound: jest.fn()
}));

// Mock Auth0 useUser hook
jest.mock("@auth0/nextjs-auth0/client", () => ({
  useUser: jest.fn(() => ({
    user: { sub: "user-123", name: "Test User", email: "test@example.com" },
    error: null,
    isLoading: false
  }))
}));

// Mock Redux
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(() => jest.fn()),
  useSelector: jest.fn((selector) => {
    // Default mock state
    const mockState = {
      user: {
        permissions: [{ permission_name: "read:users" }],
        role: { id: "role-123", name: "Admin" }
      }
    };
    return selector(mockState);
  })
}));
