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

module.exports = {
  convertToFactorialBase,
  getLexicographicPermutation,
};
