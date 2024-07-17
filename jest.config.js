module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'node'],
  transform: {
    '^.+\\.(js)$': 'babel-jest',
  },
  verbose: true,
  collectCoverage: true,
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  setupFiles: ['<rootDir>/jest.setup.js'],
};
