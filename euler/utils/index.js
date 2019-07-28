const arithmetic = require('./arithmetic');
const combinatorics = require('./combinatorics');
const common = require('./common');
const lang = require('./lang');
const primes = require('./primes');

module.exports = {
  ...arithmetic,
  ...combinatorics,
  ...common,
  ...lang,
  ...primes,
};
