/** @type {import('jest').Config} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/src'],
	testMatch: ['**/__tests__/**/*.test.ts?(x)'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
	clearMocks: true,
	setupFilesAfterEnv: ['<rootDir>/src/__tests__/jest.setup.ts'],
	coverageDirectory: '<rootDir>/coverage',
	collectCoverageFrom: [
		'src/service/**/*.ts',
		'!src/**/index.ts',
		'!src/**/generated/**',
	],
};
