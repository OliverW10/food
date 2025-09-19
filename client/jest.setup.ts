import '@testing-library/jest-native/extend-expect';
import 'whatwg-fetch';


// Global Jest setup for client project
// Extend timeout to 35s for slower integration-like tests
jest.setTimeout(35000);
