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

module.exports = {
  gcd,
  isCoprime,
  getProperDivisors,
  computeSumOfDivisors,
  reduceLCT,
  fact,
  generateFactTable,
};
