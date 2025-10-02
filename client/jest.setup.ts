import "whatwg-fetch";
process.env.API_URL = "http://localhost:3000";
// Global Jest setup for client project
// Extend timeout to 35s for slower integration-like tests
jest.setTimeout(35000);

jest.mock("expo-constants", () => ({
  expoConfig: {
    extra: {
      apiUrl: "http://localhost:3000",
    },
    hostUri: "localhost:3000",
  },
}));
