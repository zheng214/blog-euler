/**
 * @file lang.js
 * @overview Contains helper functions for string/number formatting, checking properties of a string/number, etc.
 */

// delicious pasta
// superscripts:
// ¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ⁰
// subscripts:
// ₀ ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉

/**
 * @function containsDuplicate
 * @description Check if the input contains any duplicate 'elements'
 * @description If the input is a string, check for duplicate characters
 * @description If the input is a number, check for duplicate digits
 * @description If the input is an array, check for duplicate elements
 * @param {Number|String|Number[]|String[]} input
 * @returns {Boolean}
 */
function containsDuplicate(input) {
  if (Array.isArray(input)) {
    return (new Set(input)).size !== input.length;
  }
  if (typeof input === 'string') {
    return containsDuplicate(input.split(''));
  }
  if (typeof input === 'number') {
    return containsDuplicate(input.toString().split(''));
  }
}

/**
 * @function toArray
 * @description split a number or string into a list of characters
 * @param {Number|String} param
 * @returns {String[]}
 */
function toArray(param) {
  if (typeof param === 'number') {
    return param.toString().split('');
  }
  if (typeof param === 'string') {
    return param.split('');
  }
  return param;
}

/**
 * @function flip
 * @description Reverse the digits of a number
 * @param {Number} number The number to reverse
 * @returns {Number}
 */
function flip(number) {
  return +number.toString().split('').reverse().join('');
}

/**
 * @function isPalindrome
 * @description Check if a number is a palindrome
 * @param {Number} number The number to verify
 * @returns {Boolean}
 */
function isPalindrome(number) {
  return number.toString().split('').reverse().join('') === number.toString();
}

/**
 * @function haveSameDigits
 * @description Check if every elements of an array have the same digit
 * @param {Number[]|String[]} arr List of numbers to verify
 * @returns {Boolean}
 * @example input: [123,321,213]; output: true
 * @example input: [123,324,213]; output: false
 */
function haveSameDigits(arr) {
  const formatted = arr.map(String);
  const digitTable = formatted[0].split('').reduce((a, c) => {
    a[c] = a[c] ? a[c] + 1 : 1;
    return a;
  }, {});
  const digitLength = formatted[0].split('').length;
  return formatted.every((elem) => {
    if (elem.split('').length !== digitLength) {
      return false;
    }
    let satisfyCount = Object.keys(digitTable);
    const clone = { ...digitTable };
    let satisfied = true;
    elem.split('').forEach((digit, _, a) => {
      if (!clone[digit]) {
        satisfied = false;
        a.splice(1);
        return null;
      }
      clone[digit] -= 1;
      if (clone[digit] === 0) {
        satisfyCount--;
      }
    });
    return satisfied || satisfyCount === 0;
  });
}

module.exports = {
  containsDuplicate,
  toArray,
  flip,
  isPalindrome,
  haveSameDigits,
};
