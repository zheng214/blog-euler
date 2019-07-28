// outputs an array containing the prime factorization of each associated index eg.:
// n = 2 -> 2^1 out: [0,0,1]
// n = 3 -> 3^1 out: [0,0,0,1]
// n = 4 -> 2^2 out: [0,0,2]
// n = 5 -> 5^1 out: [0,0,0,0,0,1]
// n = 6 -> 2^1 * 3^1  out: [0,0,1,1]
// n = 8 -> 2^3 out: [0,0,3]
// n = 18 -> 2^1 * 3^2 out: [0,0,1,2]
// the first two elements will always be empty
function listPrimeFactors(n) {
  let dividend = n;
  let divisor = 2;
  const computedFactors = [];
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

function gcd(a, b) {
  const smaller = a < b ? a : b;
  const bigger = a < b ? b : a;
  const allDivisorsOfSmaller = getProperDivisors(smaller).slice(1);
  allDivisorsOfSmaller.push(smaller);
  let greatestCommonDivisor = 1;
  for (let i = 0; i < allDivisorsOfSmaller.length; i++) {
    if (bigger % allDivisorsOfSmaller[i] === 0) {
      greatestCommonDivisor = allDivisorsOfSmaller[i];
    }
  }
  return greatestCommonDivisor;
}

// check if two numbers are coprime
function isCoprime(a, b) {
  return gcd(a, b) === 1;
}

// returns a list of the proper divisors of number
function getProperDivisors(number) {
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

// compute the sum of proper divisors of a number
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

// reduce a fraction to its lowest common term
function reduceLCT(numerator, denominator) {
  if (numerator === denominator) {
    return [1, 1];
  }
  if (numerator === 1 || denominator === 1) {
    return [numerator, denominator];
  }
  const subOne = numerator < denominator;
  let [a, b] = subOne ? [numerator, denominator] : [denominator, numerator];
  if (Number.isInteger(b / a)) {
    return subOne ? [1, b / a] : [b / a, 1];
  }
  let factor = 2;
  while (factor <= a) {
    let isCommonFactor = a % factor === 0 && b % factor === 0;
    while (isCommonFactor) {
      a /= factor;
      b /= factor;
      isCommonFactor = a % factor === 0 && b % factor === 0;
    }
    factor++;
  }
  return subOne ? [a, b] : [b, a];
}

// return n!
function fact(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}


// generate a table of n: n! key-value pairs
function generateFactTable(n) {
  const table = {
    0: 1,
  };
  for (let i = 1; i <= n; i++) {
    table[i] = table[i - 1] * i;
  }
  return table;
}

// generate a table of triangle numbers no greater than n
function generateTriangleNumbersTable(n) {
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

// return the nth polygonal(with s sides) number
// e.g. n = 4, s = 3 returns the 4th triangle number
// e.g. n = 11, s = 5 returns the 11th pentagonal number
function toPolygonal(n, s) {
  return (s - 2) * n * (n - 1) / 2 + n;
}

// check if a number is triangular
function isTriangular(n) {
  return (Math.sqrt(1 + 8 * n) - 1) % 2 === 0;
}

// check if a number is pentagonal
function isPentagonal(n) {
  // obtained using quadratic rule
  return (1 + Math.sqrt(1 + 24 * n)) % 6 === 0;
}

module.exports = {
  listPrimeFactors,
  gcd,
  isCoprime,
  getProperDivisors,
  computeSumOfDivisors,
  reduceLCT,
  fact,
  generateFactTable,
  generateTriangleNumbersTable,
  toPolygonal,
  isTriangular,
  isPentagonal,
};
