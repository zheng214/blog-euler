/**
 * @file lang.js
 * @overview contains helper functions for string/number formatting, checking properties of a string/number, etc.
 */


// superscripts ¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ⁰
// subscripts ₀ ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉

// check if input contains any duplicate
// if the input is a string, check for duplicate characters
// if the input is a number, check for duplicate digits
// if the input is an array, check for duplicate elements
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

// type converter
function toArray(param) {
  if (typeof param === 'number') {
    return param.toString().split('');
  }
  if (typeof param === 'string') {
    return param.split('');
  }
  return param;
}

// flips a number, eg. 196 => 691
function flip(number) {
  return +number.toString().split('').reverse().join('');
}

function isPalindrome(number) {
  return number.toString().split('').reverse().join('') === number.toString();
}

// check if all elements of the input array have the same digits
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
