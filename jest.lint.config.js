'use strict';

module.exports = {
  displayName: 'lint',
  runner: 'jest-runner-eslint',
  testMatch: [
    '<rootDir>/src/**/*.js',
    '<rootDir>/tests/**/*-test.js',
  ],
};
