function isPrime(n) {
  if (n < 2) {
    return false;
  }

  if (n === 2) {
    return true;
  }

  if (!(n & 1)) {
    return false;
  }

  let divisor = Math.floor(Math.sqrt(n));
  if (!(divisor & 1)) {
    divisor--;
  }

  while (divisor > 1) {
    if (!(n % divisor)) {
      return false;
    }
    divisor -= 2;
  }
  return true;
}

// generates a table of all primes under n by sieving all odd numbers, support for n up to 90 million
// performance: intel i5 9400F
// 1000: < 0.1ms
// 10K: 2.436ms
// 100K: 5.967ms
// 1M: 57ms
// 5M: 382ms
// 10M: 919.793ms
// 50M: 7376.009ms
// 90M: 10404.120ms
function generatePrimeTable(n) {
  // array where indexes represent all odd numbers, ie. each index i correspond to the ith odd number (except for 1)
  // e.g. sieveArr[2] = true is equivalent of saying the 2nd odd number excluding 1 (ie. 5) is prime
  const sieveArr = [];
  const root = Math.sqrt(n);
  for (let i = 1; i < root; i++) {
    const realRepr = 2 * i + 1; // e.g. i = 2 -> 5th odd number -> 5
    if (sieveArr[i] !== false) { // if index is not already sieved
      sieveArr[i] = true; // then it must be prime
      // since the indexes represent the odd numbers, we only need to sieve up to a multiple(j) such that:
      // (ith odd number) * j < n => (2*i+1)*j < n => i * j < n/(2*i+1)

      // sieve all odd multiples of i
      // e.g. let i = 3 -> we must sieve 9, 15, 21, ...
      // therefore we sieve their corresponding indexes -> 4, 7, 10, ...
      let j = 3;
      while (realRepr * j <= n) {
        // convert a real index representation to its odd counterpart
        // e.g 5 -> 2
        const oddRepr = (realRepr * j - 1) / 2;
        sieveArr[oddRepr] = false;
        j += 2;
      }
    }
  }
  const table = {};
  for (let k = 0; k <= (n - 1) / 2; k++) {
    if (k === 0) {
      table[2] = true;
    } else if (sieveArr[k] !== false) {
      table[2 * k + 1] = true;
    }
  }
  return table;
}

module.exports = {
  isPrime,
  generatePrimeTable,
};
