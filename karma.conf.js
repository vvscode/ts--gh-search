module.exports = config => {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    files: [{ pattern: './src/**/*.ts' }],
    preprocessors: {
      '**/*.ts': ['karma-typescript'],
    },
    reporters: ['progress', 'karma-typescript'],
    browsers: ['ChromeHeadless'],
    singleRun: false,
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
      reports: {
        html: 'coverage',
        text: '',
      },
    },
  });
};
