// Jest setup (can extend later for global mocks)
jest.spyOn(console, 'error').mockImplementation(() => {});
// Increase default test timeout (5s -> 35s)
jest.setTimeout(35000);
