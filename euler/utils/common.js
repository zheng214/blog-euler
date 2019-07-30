/**
 * @file common.js
 * @overview contains helper functions for code that are often used/repeated
 */

// sum over all elements of an array
function sumArray(arr, f = x => x, init = 0) {
  let sum = init;
  for (let i = 0; i < arr.length; i++) {
    sum += f(arr[i]);
  }
  return sum;
}

// returns true if the digits of n contains d
function contains(n, d) {
  return n.toString().split('').some(x => +(x) === d);
}


// insert an element into an array, keeping the array sorted from smallest to biggest
// insertLeft is the comparison function, will put the element to the left if it return true
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

module.exports = {
  sumArray,
  contains,
  insertElementSorted,
};
