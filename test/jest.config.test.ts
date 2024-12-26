export default {
  displayName: 'auth-test', // Optional: name of the test
  testRegex: './*.spec.ts$', // Path to your specific test files
  preset: 'ts-jest', // If using TypeScript, adjust based on your setup
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
