module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  globals: {
    'babel-jest': {
      useESM: true,
    },
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  coveragePathIgnorePatterns: ['/node_modules/'],
};
