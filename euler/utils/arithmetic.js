/**
 * @file arithmetic.js
 * @overview Contains algorithms for factorization, divisibility, and other miscellaneous algebra/number theory related tools
 */

/**
 * @function isOdd
 * @description Check if a number is odd
 * @param {Number} number Positive integer
 * @returns {Boolean}
 */
function isOdd(number) {
  return !!(number & 1);
}

/**
 * @function isEven
 * @description Check if a number is even
 * @param {Number} number Positive integer
 * @returns {Boolean}
 */
function isEven(number) {
  return !(number & 1);
}

/**
 * @function listPrimeFactors
 * @description List the powers of prime factors of a number
 * @param {Number} n Positive integer
 * @returns {Number[]} List of powers of prime factors of n
 * @example input: 12 ( = 2² * 3¹); output: [0, 0, 2, 1]
 * @example input: 20 ( = 2² * 3⁰ * 4⁰ * 5¹); output: [0, 0, 2, 0, 0, 1]
 */
function listPrimeFactors(n) {
  let dividend = n;
  let divisor = 2;
  const computedFactors = [0, 0];
  while (dividend > 1) {
    let power = 0;
    while (dividend % divisor === 0) {
      dividend /= divisor;
      power++;
    }
    computedFactors[divisor] = power;
    divisor++;
  }
  return computedFactors;
}

/**
 * @function gcd
 * @description Computes the greatest common divisor between 2 numbers using the euclidean algorithm
 * @param {Number} a Positive integer
 * @param {Number} b Positive integer
 * @returns {Number} gcd(a, b)
 * @example input: (12, 30); output: 6
 */
function gcd(a, b) {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
}

/**
 * @function isCoprime
 * @description Check whether two numbers are coprime
 * @param {Number} a Positive integer
 * @param {Number} b Positive integer
 * @returns {Boolean} True iff a and b are coprime
 * @example input: (12, 30); output: false
 * @example input: (12, 17); output: true
 * @see gcd
 */
function isCoprime(a, b) {
  return gcd(a, b) === 1;
}

/**
 * @function listProperDivisors
 * @description List the proper divisors of a number
 * @param {Number} number Positive integer
 * @returns {Number[]} List of proper divisors of the input
 * @example input: 36; output: [1, 2, 3, 4, 6, 9, 12, 18]
 */
function listProperDivisors(number) {
  const root = Math.sqrt(number);
  const properDivisors = [];
  let divisor = Math.floor(root);
  if (divisor === root) {
    properDivisors.push(root);
    divisor--;
  }
  while (divisor > 0) {
    const quotient = number / divisor;
    if (Number.isInteger(quotient)) {
      properDivisors.push(divisor);
      if (divisor !== 1) {
        properDivisors.push(quotient);
      }
    }
    divisor--;
  }
  return properDivisors.sort((a, b) => a - b);
}

/**
 * @function computeSumOfDivisors
 * @description Find the sum of the proper divisors of a number
 * @param {Number} number Positive integer
 * @returns {Number} Sum of the proper divisors of the input
 * @example input: 36; output: 55
 */
function computeSumOfDivisors(number) {
  const root = Math.sqrt(number);
  let sum = 0;
  let divisor = Math.floor(root);
  if (divisor === root) {
    sum += root;
    divisor--;
  }
  while (divisor > 0) {
    const quotient = number / divisor;
    if (Number.isInteger(quotient)) {
      sum += divisor;
      if (divisor !== 1) {
        sum += quotient;
      }
    }
    divisor--;
  }
  return sum;
}

/**
 * @function reduceLCT
 * @description Reduce a fraction to its lowest common terms
 * @param {Number} numerator Positive integer
 * @param {Number} denominator Positive integer
 * @returns {Number[]} Array containing the reduced numerator and denominator, respectively
 * @example input: (12, 30); output: [2, 5]
 * @see gcd
 */
function reduceLCT(numerator, denominator) {
  const greatestCommonDivisor = gcd(numerator, denominator);
  return [numerator / greatestCommonDivisor, denominator / greatestCommonDivisor];
}

/**
 * @function generateTriangulars
 * @description Generates a table where the keys are the triangle numbers no greater than n
 * @param {Number} n Upper bound, inclusive
 * @returns {Object} The table of triangular number keys
 * @example input: 10; output: { 1: true, 2: true, 3: true, 6: true, 10: true }
 */
function generateTriangulars(n) {
  const table = {};
  let triangle = 1;
  let incr = 1;
  while (triangle < n) {
    table[triangle] = true;
    incr++;
    triangle += incr;
  }
  return table;
}

/**
 * @function toPolygonal
 * @description Finds the nth polygonal (with s sides) number
 * @param {Number} n Index of the polygon
 * @param {Number} s Sides of the polygon
 * @returns {Number}
 * @example input: (4, 3); output: 10 // (4th triangular number)
 * @example input: (3, 5); output: 9 // (3rd pentagonal number)
 */
function toPolygonal(n, s) {
  return (s - 2) * n * (n - 1) / 2 + n;
}

/**
 * @function isTriangular
 * @description Check if a number is triangular (e.g. 1, 2, 3, 6, 10, 15, ...)
 * @param {Number} n Positive integer
 * @returns {Boolean}
 */
function isTriangular(n) {
  return (Math.sqrt(1 + 8 * n) - 1) % 2 === 0;
}

/**
 * @function isPentagonal
 * @description Check if a number is pentagonal (e.g. 1, 5, 12, 22, 35, ...)
 * @param {Number} n Positive integer
 * @returns {Boolean}
 */
function isPentagonal(n) {
  // obtained using quadratic rule
  return (1 + Math.sqrt(1 + 24 * n)) % 6 === 0;
}

module.exports = {
  isOdd,
  isEven,
  listPrimeFactors,
  gcd,
  isCoprime,
  listProperDivisors,
  computeSumOfDivisors,
  reduceLCT,
  generateTriangulars,
  toPolygonal,
  isTriangular,
  isPentagonal,
};
