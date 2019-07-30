/**
 * @file combinatorics.js
 * @overview contains helper functions for computing combinations (factorials, permutations, binomial combinations, etc.)
 */

const lang = require('./lang');

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


/**
 * @function convertToFactorialBase
 * @description converts a number into its factorial representation
 * @param {Number} n the number to convert
 * @returns {String} number written in factorial representation
 */
function convertToFactorialBase(n) {
  // we first need to determine the highest factorial number smaller than n
  let i = 1;
  let factorials = [1];
  while (factorials[i - 1] * (i + 1) <= n) { // exit if next factorial is bigger than n
    i++;
    factorials.push(factorials[i - 2] * i);
  }
  factorials = factorials.reverse();
  // i is the number of digits in our factorial representation of n
  // factorials contains the list of factorials smaller than n, from biggest to smallest

  let dividend = n;
  let repr = '';
  for (let j = 0; j < factorials.length; j++) {
    const quotient = Math.floor(dividend / factorials[j]);
    dividend %= factorials[j];
    repr += quotient.toString();
  }
  return repr;
}

/**
 * @function getLexicographicPermutation
 * @description get the nth lexicographic permutation of arr (generalized function of problem 24)
 * @param {Number|Number[]|String|String[]} arr
 * @param {Number} n
 */
function getLexicographicPermutation(arr, n) {
  const factorialRepr = utils.convertToFactorialBase(n - 1).padStart(arr.length - 1, '0');
  const result = [];

  let remainingElements = [];
  if (typeof arr === 'number') {
    remainingElements = arr.toString().split('');
  }
  if (typeof arr === 'string') {
    remainingElements = arr.split('');
  }
  if (Array.isArray(arr)) {
    remainingElements = arr.map(x => x.toString());
  }

  for (let k = 0; k < factorialRepr.length; k++) {
    const indexToPick = factorialRepr.charAt(k);
    const pickedElement = remainingElements[indexToPick];
    result.push(pickedElement);
    remainingElements = remainingElements.filter(x => x !== pickedElement);
  }

  // add last digit remaining
  return [...result, ...remainingElements];
}

// return n choose p
function choose(n, p) {
  return fact(n) / (fact(n - p) * fact(p));
}

// input: 2 arrays a1, a2 of length l1 and l2
// output: array of length ((l1 + l2) choose l1) of all combinations of elements of a1 and a2, where elements of the same array
// are considered to be similar
// e.g. a1 = [0,1], a2 = [2,2]
// result = [
//  [0, 1, 2, 2], [0, 2, 1, 2], [0, 2, 2, 1], [2, 0, 1, 2], [2, 0, 2, 1], [2, 2, 0, 1]
// ]
function computeBinomialCombinations(a1, a2) {
  const combinations = [];
  const f1 = [...lang.toArray(a1)];
  const f2 = [...lang.toArray(a2)]; // formatted
  let baseArr = f2;
  let insertArr = f1;
  if ((f1.length + 1) ** f2.length < (f2.length + 1) ** f1.length) { // minimize loop count
    baseArr = f1;
    insertArr = f2;
  }
  const equivalenceTable = {};

  // generate the table of unique insert rules
  for (let i = 0; i < (baseArr.length + 1) ** insertArr.length; i++) {
    const insertRule = i.toString(baseArr.length + 1);
    if (!equivalenceTable[insertRule.split('').sort().join('')]) {
      equivalenceTable[insertRule.padStart(insertArr.length, '0')] = true;
    }
  }

  // for each insert rule, insert the elements of insertArr into baseArr according to rules, then push result to combinations
  const insertRules = Object.keys(equivalenceTable);
  for (let i = 0; i < insertRules.length; i++) {
    const elevatedBase = [[], ...baseArr.map(x => [x])];
    const insertRule = insertRules[i];
    insertRule.split('').forEach((insertIndex, idx) => {
      elevatedBase[+insertIndex].push(insertArr[idx]);
    });
    combinations.push(elevatedBase.reduce((acc, curr) => [...acc, ...curr]));
  }
  return combinations;
}

module.exports = {
  fact,
  generateFactTable,
  convertToFactorialBase,
  getLexicographicPermutation,
  choose,
  computeBinomialCombinations,
};
