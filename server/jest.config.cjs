/** @type {import('jest').Config} */
module.exports = {
	preset: 'ts-jest/presets/default-esm',
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
	transform: {
		'^.+\\.[tj]sx?$': [
			'ts-jest',
			{
				useESM: true,
				tsconfig: '<rootDir>/tsconfig.json',
				diagnostics: true,
			},
		],
	},
	extensionsToTreatAsEsm: ['.ts'],
	// Transform ESM deps like superjson
	transformIgnorePatterns: ['node_modules/(?!(superjson)/)'],
};
