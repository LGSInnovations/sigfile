module.exports = {
  preset: 'jest-puppeteer',
  testRegex: './*\\.test|\\.browsertest\\.js$',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: ['./src/**/*.js'],
};
