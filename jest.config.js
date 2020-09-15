module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.js',
    '!**/*.test.js'
  ],
  coverageDirectory: 'test-output',
  coverageReporters: [
    'text-summary',
    'cobertura',
    'lcov'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/test-output/',
    '<rootDir>/test/',
    '.*/__mocks__/.*',
    '<rootDir>/jest.config.js'
  ],
  coverageThreshold: {
    global: {
      statements: 70
    }
  },
  modulePathIgnorePatterns: [
    'node_modules'
  ],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'jest tests',
        outputDirectory: 'test-output',
        outputName: 'junit.xml'
      }
    ]
  ],
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    'test/contract/',
    'test/integration/local/',
    'test/unit/services/message-sender.test.js'
  ],
  verbose: true
}
