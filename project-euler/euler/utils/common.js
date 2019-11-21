/**
 * @file common.js
 * @overview Contains helper functions for code that are often used/repeated
 */

/**
 * @function sumArray
 * @description 'Sum' over all elements of an array, with a mapper applied to each element (similar to mapReduce)
 * @param {Number[]|String[]} arr The array to sum
 * @param {Function} f Map function
 * @param {Number|String} init Initial value
 * @returns {Number|String}
 * @example input: ([1,2,3], x => 2 * x, 5); output: 17
 */
function sumArray(arr, f = x => x, init = 0) {
  let sum = init;
  for (let i = 0; i < arr.length; i++) {
    sum += f(arr[i]);
  }
  return sum;
}

/**
 * @function contains
 * @description Check if the number n contains a digit d
 * @param {Number|String} n The number from where we check the digits
 * @param {Number} d The digit
 * @returns {Boolean}
 * @example input: (123, 3); output: true
 * @example input: (14235968, 7); output: false
 */
function contains(n, d) {
  return n.toString().split('').some(x => +(x) === d);
}


/**
 * @function insertElementSorted
 * @description Insert an element into an array, keeping the array sorted from smallest to biggest
 * @param {Array} arr The original array
 * @param {Number|String} element The element to insert
 * @param {Function} insertLeft The comparison function, will put the element to the left if it return true
 * @returns {Array} The array with inserted element
 * @example input: ([1,4,5], 3); output: [1,3,4,5]
 */
function insertElementSorted(arr, element, insertLeft = (e, a) => e < a) {
  const arrLen = arr.length;
  if (arrLen === 0) {
    return [element];
  }
  if (arrLen === 1) {
    return insertLeft(element, arr[0]) ? [element, ...arr] : [...arr, element];
  }
  const middleIndex = Math.floor((arrLen) / 2);
  const left = arr.slice(0, middleIndex);
  const right = arr.slice(middleIndex, arrLen);
  if (insertLeft(element, arr[middleIndex])) {
    return [...insertElementSorted(left, element), ...right];
  }
  return [...left, ...insertElementSorted(right, element)];
}

/**
 * @function initTable
 * @description Initiate a table of size row x col
 * @param {Number} row Number of arrays in the table
 * @param {Number} col Number of elements in each array
 * @param {Function} f Map function, where the inputs are the row and column indexes, respectively
 * @returns {Array[]} The result table (2D array)
 * @example input: (2, 2, (i,j) => i * j); output: [[0,0], [0,1]]
 */
function initTable(row, col, f = () => 0) {
  return [...Array(row)].map((_1, i) => [...Array(col)].map((_2, j) => f(i, j)));
}

module.exports = {
  sumArray,
  contains,
  insertElementSorted,
  initTable,
};
