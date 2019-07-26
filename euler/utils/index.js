const arithmetic = require('./arithmetic');
const combinatorics = require('./combinatorics');
const common = require('./common');
const primes = require('./primes');

module.exports = {
  ...arithmetic,
  ...combinatorics,
  ...common,
  ...primes,
};
