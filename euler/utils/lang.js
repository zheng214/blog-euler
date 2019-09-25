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

module.exports = {
  containsDuplicate,
  toArray,
  flip,
  isPalindrome,
};
