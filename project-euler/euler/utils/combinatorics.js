/**
 * @file combinatorics.js
 * @overview Contains helper functions for computing combinations (factorials, permutations, combinations, etc.)
 */

const lang = require('./lang');

/**
 * @function fact
 * @description Compute factorial of a number
 * @param {Number} n Positive integer
 * @returns {Number}
 * @example input: 8; output: 40320
 */
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

/**
 * @function generateFactTable
 * @description Generate a table of n: n! key-value pairs
 * @param {Number} n Number of pairs to generate
 * @returns {Object}
 * @example input: 4; output: { 0: 1, 1: 1, 2: 2, 3: 6, 4: 24, 5: 120 }
 */
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
 * @description Converts a number into its factorial representation
 * @param {Number} n The number to convert
 * @returns {String} Number written in factorial representation
 * @example input: 12; output: '200'
 * @example input: 13; output: '201'
 * @example input: 14; output: '210'
 * @example input: 16; output: '220'
 * @example input: 20; output: '310'
 * @example input: 24; output: '1000'
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
 * @function getLexicalPermutation
 * @description Get the nth lexicographic permutation of arr (generalized function of problem 24)
 * @param {Number|Number[]|String|String[]} arr List of characters
 * @param {Number} n nth permutation (n > 0)
 * @returns {String[]}
 * @example input: ('123', 1); output: ['1', '2', '3']
 * @example input: ('123', 2); output: ['1', '3', '2']
 * @example input: ('123', 3); output: ['2', '1', '3']
 * @example input: ('123', 4); output: ['2', '3', '1']
 * @example input: ('123', 5); output: ['3', '1', '2']
 * @example input: ('123', 6); output: ['3', '2', '1']
 */
function getLexicalPermutation(arr, n) {
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

  const factorialRepr = convertToFactorialBase(n - 1).padStart(remainingElements.length - 1, '0');

  for (let k = 0; k < factorialRepr.length; k++) {
    const indexToPick = factorialRepr.charAt(k);
    const pickedElement = remainingElements[indexToPick];
    result.push(pickedElement);
    remainingElements = remainingElements.filter(x => x !== pickedElement);
  }

  return [...result, ...remainingElements];
}

/**
 * @function choose
 * @description Computes n choose p, or the number of ways of selecting p sub-elements from n elements
 * @param {Number} n The size of the set to select from
 * @param {Number} p The number of elements to select (p <= n)
 * @returns {Number}
 * @example input: (4, 2); output: 6
 * @example input: (6, 3); output: 20
 */
function choose(n, p) {
  return fact(n) / (fact(n - p) * fact(p));
}

/**
 * @function listOrderedCombinations
 * @description Enumerate the list of permutations of joining elements from 2 arrays
 * @description where the elements within the same array are considered to be similar, and their orders are preserved
 * @param {Array} a1 First array (max length: 35)
 * @param {Array} a2 Second array (max length: 35)
 * @returns {Array[]} List of combinations (each combination is an array)
 * @example input: ([1,0], [2,2]); output: [[1, 0, 2, 2], [0, 2, 1, 2], [0, 2, 2, 1], [2, 1, 0, 2], [2, 0, 2, 1], [2, 2, 1, 0]]
 */
function listOrderedCombinations(a1, a2) {
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
  // insertRule := the indexes of the baseArr where to insert the elements of insertArr
  // eg. baseArr.length = 2, insertArr.length = 2;
  // insertRules = ['00', '01', '02', '10', '11', '12', '20', '21', '22']
  // Also, since each element is considered equivalent inside their array,
  // the '12' and '21' rules are redundant (so are '01' and '10', '20' and '02', etc.)
  for (let i = 0; i < (baseArr.length + 1) ** insertArr.length; i++) {
    const insertRule = i.toString(baseArr.length + 1);
    if (!equivalenceTable[insertRule.split('').sort().join('')]) {
      equivalenceTable[insertRule.padStart(insertArr.length, '0')] = true;
    }
  }

  // for each insert rule, insert the elements of insertArr into baseArr according to rules,
  // then push result to combinations
  const insertRules = Object.keys(equivalenceTable);
  const combinations = [];

  for (let i = 0; i < insertRules.length; i++) {
    const elevatedBase = [[], ...baseArr.map(x => [x])];
    const insertRule = insertRules[i];
    insertRule.split('').forEach((insertIndex, idx) => {
      const numeralIndex = /^[a-z]{1}$/.test(insertIndex)
        ? insertIndex.charCodeAt(0) - 87 // a -> 10, b -> 11, ...
        : +insertIndex;
      elevatedBase[numeralIndex].push(insertArr[idx]);
    });
    combinations.push(elevatedBase.reduce((acc, curr) => [...acc, ...curr]));
  }

  return combinations;
}

module.exports = {
  fact,
  generateFactTable,
  convertToFactorialBase,
  getLexicalPermutation,
  choose,
  listOrderedCombinations,
};
