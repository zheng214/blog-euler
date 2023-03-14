
const fs = require('fs');
const path = require('path');
const utils = require('../utils');

module.exports = {
  /**
   * Problem 31: Coin sums
   * In England the currency is made up of pound, £, and pence, p, and there are eight coins in general circulation:
   *
   * 1p, 2p, 5p, 10p, 20p, 50p, £1 (100p) and £2 (200p).
   *
   * It is possible to make £2 in the following way:
   *
   * 1×£1 + 1×50p + 2×20p + 1×5p + 1×2p + 3×1p
   *
   * @question How many different ways can £2 be made using any number of coins?
   * @guide
   * Starting out with 2£, we branch out all the possible scenarios for using each amount of each type of coin, going from largest coin to smallest.
   * The comments in the code explain in detail how it's done.
   */
  e31() {
    const CHANGES = [1, 2, 5, 10, 20, 50, 100, 200];
    // our final result
    let changes = 0;

    // our algorithm works by traversing down a 'tree'
    // we start with the top level: 200
    // [tree level: 200] we create 2 branches: left (using 200) and right (not using 200)
    // from each branch we find the amount of combinations of the next coin
    // [tree level: 200] left branch used 200, has 0 left, return 1 (1 way to make 200 using 200p coins)
    // [tree level: 200] right branch did not use 200, has 200 left, now we can either:
    // [tree level: 100] use 2 100p coins, 1 100p coins, or 0 100p coins, -> we create 3 branches for the next level
    // the tree looks like this:
    // [root]            200
    //                  /   \
    // [level: 200]    0    200
    //                     / | \
    // [level: 100]       0 100 200
    //                       |   \
    // [level: 50]          ...  ...
    //
    // when we reach level 2, we can stop and return Math.floor(amountLeft / 2) + 1
    // which is equal to the number of ways we can make amountLeft using only 2p and 1p

    function makeChange(amountLeft, levelIndex = CHANGES.length - 1) {
      if (amountLeft < 0) {
        // dead branch
        return 0;
      }
      if (levelIndex === 1) {
        // reached leaf
        return Math.floor(amountLeft / 2) + 1;
      }
      if (amountLeft === 1 || amountLeft === 0) {
        // there is only 1 way to make 1p
        // also if amountLeft is 0, it means we called makeChange on amountLeft with a coin equal to it
        // eg. using 200p coin to make 200p, there is only 1 way
        return 1;
      }
      for (let i = 0; i <= Math.floor(amountLeft / CHANGES[levelIndex]); i++) {
        // 'generate' branches according to amountLeft/level
        const changesAtLevel = makeChange(amountLeft - i * CHANGES[levelIndex], levelIndex - 1);
        changes += changesAtLevel;
      }
      return 0;
    }

    makeChange(200);
    return changes;
  },

  /**
   * Problem 32: Pandigital products
   * The product 7254 is unusual, as the identity, 39 × 186 = 7254, containing multiplicand, multiplier, and product is 1 through 9 pandigital.
   *
   * @question Find the sum of all products whose multiplicand/multiplier/product identity can be written as a 1 through 9 pandigital.
   *
   * @question HINT: Some products can be obtained in more than one way so be sure to only include it once in your sum.
   * @guide
   * Let a * b = c (for convenience, assume a < b), we know that c must have 4 digits because if digits(c) > 4, a * b < c and if digits(c) < 4, a * b > c.
   * We just need to check values of c from 1234 to 9876, and find 1 < a <= 98 st. our condition is satisfied
   */
  e32() {
    const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const pandigitalProducts = [];
    for (let i = 1111; i <= 9876; i++) {
      const selectionIndexes = i.toString().split('');
      // we only check if the selection is valid
      if (+(selectionIndexes[1]) < 9
        && +(selectionIndexes[2]) < 8
        && +(selectionIndexes[3]) < 7
        && !selectionIndexes.some(x => x === '0')
      ) {
        let c = '';
        let remainingDigits = [...DIGITS];
        selectionIndexes.forEach(
          (selectionIndex) => {
            const selected = remainingDigits[selectionIndex - 1].toString();
            c += selected;
            remainingDigits = remainingDigits.filter(x => x !== remainingDigits[selectionIndex - 1]);
          },
        );

        c = +(c);
        const root = Math.sqrt(c);

        // now assume that a has only 1 digit, check for pandigital equations
        let a;
        let isPandigital = false;
        for (a = 0; a < remainingDigits.length; a++) {
          const dividend = remainingDigits[a];
          const b = c / dividend;
          if (Number.isInteger(b)) {
            if (b.toString().split('').sort().join('') === remainingDigits.filter(x => x !== dividend).join('')) {
              pandigitalProducts.push(c);
              isPandigital = true;
              break;
            }
          }
        }
        if (!isPandigital) {
          // now assume a has 2 digits, check for pandigital equations
          for (let j = 11; j <= 54; j++) {
            // we select 2 digits from the remaining pool of 5
            const selectionIndexes2 = j.toString().split('');
            if (selectionIndexes2[0] < 6 && selectionIndexes2[1] < 5 && !selectionIndexes2.some(x => x === '0')) {
              let a2 = '';
              let remainingDigits2 = [...remainingDigits]; // remaining digits after a second round of selection
              selectionIndexes2.forEach(
                (selectionIndex2) => {
                  const selected = remainingDigits2[selectionIndex2 - 1].toString();
                  a2 += selected;
                  remainingDigits2 = remainingDigits2.filter(x => x !== remainingDigits2[selectionIndex2 - 1]);
                },
              );
              a2 = +(a2);
              if (a2 < root) {
                const b = c / a2;
                if (Number.isInteger(b)) {
                  if (b.toString().split('').sort().join('') === remainingDigits2.join('')) {
                    pandigitalProducts.push(c);
                    break;
                  }
                }
              }
            }
          }
        }
      }
    }
    return utils.sumArray(pandigitalProducts);
  },

  /**
   * Problem 33: Digit cancelling fractions
   *
   * The fraction 49/98 is a curious fraction, as an inexperienced mathematician in attempting to simplify it may incorrectly believe that 49/98 = 4/8, which is correct, is obtained by cancelling the 9s.
   *
   * We shall consider fractions like, 30/50 = 3/5, to be trivial examples.
   *
   * There are exactly four non-trivial examples of this type of fraction, less than one in value, and containing two digits in the numerator and denominator.
   *
   * @question If the product of these four fractions is given in its lowest common terms, find the value of the denominator.
   * @guide
   * We check all fractions of the form mx/xn, where:
   * 1. 1 <= m, n, x <= 9
   * 2. m =/= n
   */
  e33() {
       const curiousFractions = [];
    for (let m = 1; m <= 9; m++) {
      for (let n = 1; n <= 9; n++) {
        if (m !== n) {
          for (let x = 1; x <= 9; x++) {
            const numerator = (10 * m) + x;
            const denominator = (x * 10) + n;
            const fraction = numerator / denominator;
            if (fraction === m / n) {
              curiousFractions.push({ numerator, denominator });
            }
          }
        }
      }
    }

    const productFraction = curiousFractions.reduce(
      (acc, curr) => {
        acc.numerator *= curr.numerator;
        acc.denominator *= curr.denominator;
        return acc;
      },
      {
        numerator: 1,
        denominator: 1,
      },
    );

    return utils.reduceLCT(productFraction.numerator, productFraction.denominator)[1];
  },

  /**
   * Problem 34: Digit factorials
   * 145 is a curious number, as 1! + 4! + 5! = 1 + 24 + 120 = 145.
   *
   * @question Find the sum of all numbers which are equal to the sum of the factorial of their digits.
   *
   * @question Note: as 1! = 1 and 2! = 2 are not sums they are not included.
   * @guide
   * We just search through all numbers, with some pruning explained in the comments in the code.
   */
  e34() {
    const FACTORIALS = utils.generateFactTable(9);
    const curiousNumbers = [];

    // check whether n is curious
    function isCurious(n) {
      return utils.sumArray(n.toString().split(''), x => FACTORIALS[x]) === n;
    }

    // ensures that none of n's digits exceed d
    function boundedBy(n, d) {
      return n.toString().split('').every(x => +(x) <= d);
    }

    // check if number `n` contains exactly `c` copies of the digit `d`
    function containExactly(n, d, c) {
      return n.toString().split('').filter(x => +(x) === d).length === c;
    }


    // we note that curious numbers must have between 3 and 7 digits, since 8 * 9! < 10^8
    // and we can quickly manually verify that numbers with 2 digits cannot be curious

    // for each digit count we use a heuristic to prune some numbers
    for (let d = 3; d <= 7; d++) {
      // for 3-digit numbers (n₃), we notice that
      // 1. n₃ < 700 since 7! > 999
      // 2. to comply with above, n₃ cannot contain a digit > 5
      if (d === 3) {
        for (let i = 100; i <= 555; i++) {
          if (boundedBy(i, 5) && isCurious(i)) curiousNumbers.push(i);
        }
      }

      // for 4-digit numbers (n₄), we have two main options, either use one 7, or no 7
      // if not using 7, upper bound is 4 * 6! = 2880
      // if using one 7, lower bound is 7000, upper bound is 5040 + 3 * 6! = 7200
      if (d === 4) {
        // no 7
        for (let i = 1000; i < 2880; i++) {
          if (boundedBy(i, 6) && isCurious(i)) curiousNumbers.push(i);
        }
        for (let i = 7000; i < 7200; i++) {
          if (containExactly(i, 7, 1) && isCurious(i)) curiousNumbers.push(i);
        }
      }

      // for 5-digit numbers, the options are to use 2 8's, 1 8, or no 8
      if (d === 5) {
        // no 8
        // upper bound is 5 * 7! = 25200
        // since our number < 25200, we cannot have five 7's, as the first digit is either 1 or 2
        // therefore our upper bound becomes 4 * 7! = 20160
        // we can lower it down further by noticing that we must be using four 7's
        for (let i = 10000; i < 17777; i++) {
          if (boundedBy(i, 7) && isCurious(i)) curiousNumbers.push(i);
        }

        // the same min-maxing upper/lower bound logic is applied
        // to all further digit count and code below
        // using one 8
        for (let i = 40320; i < 57778; i++) {
          if (boundedBy(i, 8) && containExactly(i, 8, 1) && isCurious(i)) curiousNumbers.push(i);
        }

        // using two 8's
        for (let i = 80640; i < 88777; i++) {
          if (boundedBy(i, 8) && containExactly(i, 8, 2) && isCurious(i)) curiousNumbers.push(i);
        }
      }

      // for 6-digit numbers, the options are to use two 9's, one 9, or no 9
      // if we use more than two 9s, the sum will exceed 6 digits
      if (d === 6) {
        // two 9's
        for (let i = 725799; i < 886998; i++) {
          if (containExactly(i, 9, 2) && isCurious(i)) curiousNumbers.push(i);
        }

        // one 9
        for (let i = 362889; i < 488889; i++) {
          if (containExactly(i, 9, 1) && isCurious(i)) curiousNumbers.push(i);
        }

        // no 9
        for (let i = 100088; i < 158888; i++) {
          if (boundedBy(i, 8) && isCurious(i)) curiousNumbers.push(i);
        }
      }

      // for 7 digit numbers, we must use 4 9's
      if (d === 7) {
        // 4 9's
        for (let i = 1459999; i < 1489999; i++) {
          if (containExactly(i, 9, 4) && isCurious(i)) curiousNumbers.push(i);
        }
      }
    }
    return utils.sumArray(curiousNumbers);
  },

  /**
   * Problem 35: Circular primes
   * The number, 197, is called a circular prime because all rotations of the digits: 197, 971, and 719, are themselves prime.
   *
   * There are thirteen such primes below 100:
   *
   * 2, 3, 5, 7, 11, 13, 17, 31, 37, 71, 73, 79, and 97.
   *
   * @question How many circular primes are there below one million?
   * @guide
   * We generate a table of 1 million primes. For each prime, we check if every rotation is also in the table.
   */
  e35() {
    const PRIMES_TABLE = utils.generatePrimesTable(1000000);
    const PRIMES = Object.keys(PRIMES_TABLE);
    const circularPrimes = {};

    for (let p of PRIMES) {
      // if p < 100, skip it
      if (p < 100) {
        continue;
      }
      // if p contains a digit that is even, we can skip it.
      if (p.toString().split('').some(x => ['0', '2', '4', '6', '8'].includes(x))) {
        continue;
      }
      let allRotations = computeRotations(p);
      if (allRotations.every(x => PRIMES_TABLE[x])) {
        for (r of allRotations) {
          circularPrimes[r] = true;
        }
      }
    }

    // returns an array with all rotations of p, including p itself
    function computeRotations(p) {
      const rotations = [p];
      const numberString = p.toString();
      const digits = numberString.split('').length;
      for (let i = 1; i < digits; i++) {
        const left = numberString.substring(0, i);
        const right = numberString.substring(i, numberString.length);
        rotations.push(+`${right}${left}`);
      }
      return rotations;
    }

    return Object.keys(circularPrimes).length + 13; // there are 13 rotations under 100 (given)
  },

  /**
   * Problem 36: Double-base palindromes
   * The decimal number, 585 = 1001001001 (binary), is palindromic in both bases.
   * @question Find the sum of all numbers, less than one million, which are palindromic in base 10 and base 2.
   * @guide
   * We loop through each decimal palindrome and check whether its binary representation is also palindromic
   * Note that even numbers cannot be palindromic in its binary representation
   */
  e36() {
    const doublePalindromes = [];
      for (let i = 1; i <= 999; i++) {
      // we can skip the numbers whose leading digit is even
      if (i.toString().charAt(0) & 1) {
        // we generate a list of palindromes based on current index
        // ie. i = 57 -> 5775, 57075, 57175, ..., 57975
        const evenDigitPalindrome = +(`${i.toString()}${i.toString().split('').reverse().join('')}`);
        let oddDigitPalindromes = [];
        if (i < 100) { // we don't want to generate 7 digit palindromes
          oddDigitPalindromes = [...Array(10)].map(
            (x, idx) => +(`${i.toString()}${idx}${i.toString().split('').reverse().join('')}`)
          );
        }
        const decimalPalindromes = [evenDigitPalindrome, ...oddDigitPalindromes];
        decimalPalindromes.forEach((dp) => {
          const bin = dp.toString(2);
          if (bin === bin.split('').reverse().join('')) {
            doublePalindromes.push(dp);
          }
        });
      }
    }
    // we did not yet take into account the numbers under 10 (which are palindromes by default)
    // 1,3,5,7,9 are all binary palindromes, their sum is 25
    return utils.sumArray(doublePalindromes) + 25;
  },

  /**
   * Problem 37: Truncatable primes
   * The number 3797 has an interesting property. Being prime itself, it is possible to continuously remove digits from left to right, and remain prime at each stage: 3797, 797, 97, and 7. Similarly we can work from right to left: 3797, 379, 37, and 3.
   *
   * @question Find the sum of the only eleven primes that are both truncatable from left to right and right to left.
   *
   * @question NOTE: 2, 3, 5, and 7 are not considered to be truncatable primes.
   * @guide
   * We start with two arrays, the append array [2, 3, 5, 7], which we will append numbers to, and the preppend array [3, 7], which we will preppend numbers to.
   * After one step, the append array will become [3, 5, 7, 21, 23, 27, 29]
   * After two step, it will become [5, 7, 21, 23, 27, 29, 31, 33, 37, 39]
   * After one step, the preppend array will become [7, 13, 23, 33, 53, 73, 93]
   * After two step, it will become [13, 23, 33, 53, 73, 93, 17, 27, 37, 57, 77, 97]
   * A truncatable prime is valid only if we can find it in both the append array and the preppend array.
   * In the example given above, 37 is the only prime satisfying those conditions, and it is a truncatable prime.
   * We keep expanding our arrays until none of the numbers in our array are prime.
   */
  e37() {
    const truncatedPrimes = [];

    // Appending an even number, or the number 5, to any number, will make that number composite.
    const validDigitsA = [1, 3, 7, 9];

    // 2 and 5 are valid digit for preppending, however, they are only valid as the leading digit in a number
    const validDigitsP = [1, 2, 3, 5, 7, 9];

    // we use BFS on a tree, where the root is a starting digit
    // for each number in root, we create 2 trees, one for only appending numbers (TA), and the other preppending (TP)
    // everytime we traverse down, we can prune a number if it is not prime

    // a number is a valid truncated prime if it is seen once in TA and once in TP
    const seen = { };

    // 1, 9 cannot be a root as it is not prime
    const queueA = [2, 3, 5, 7]; // queue for append
    // queue for preppend (preppending to a 2 or 5 will automatically make a number composite)
    const queueP = [3, 7];

    while (queueA.length || queueP.length) {
      if (queueA.length) {
        const nodeA = queueA.shift();
        if (seen[nodeA] && nodeA.toString().length > 1) {
          truncatedPrimes.push(nodeA);
          validDigitsA.forEach((vd) => {
            queueA.push(+(`${nodeA}${vd}`));
          });
        } else if (utils.isPrime(nodeA)) {
          seen[nodeA] = true;
          validDigitsA.forEach((vd) => {
            queueA.push(+(`${nodeA}${vd}`));
          });
        }
      }
      if (queueP.length) {
        const nodeP = queueP.shift();
        const firstDigitOfNode = +(nodeP.toString().charAt(0));

        // preppending to 2, 5 will result in a composite right truncation
        const stopPreppend = firstDigitOfNode === 2 || firstDigitOfNode === 5;

        // preppending the same digit to the leading digit eg. 357 -> 3357
        // will result in the first 2 leading digit to be divisible by 11
        // except when the leading digit is 1, then preppending by 1 is still fine as 11 is prime
        const validDigits = validDigitsP.filter(x => x === 1 || x !== firstDigitOfNode);
        if (seen[nodeP] && nodeP.toString().length > 1) {
          truncatedPrimes.push(nodeP);
          if (!stopPreppend) {
            validDigits.forEach((vd) => {
              queueP.push(+(`${vd}${nodeP}`));
            });
          }
        } else if (utils.isPrime(nodeP)) {
          seen[nodeP] = true;
          if (!stopPreppend) {
            validDigits.forEach((vd) => {
              queueP.push(+(`${vd}${nodeP}`));
            });
          }
        }
      }
    }

    return utils.sumArray(truncatedPrimes);
  },

  /**
   * Problem 38: Pandigital multiples
   * Take the number 192 and multiply it by each of 1, 2, and 3:
   *
   * 192 × 1 = 192
   *
   * 192 × 2 = 384
   *
   * 192 × 3 = 576
   *
   * By concatenating each product we get the 1 to 9 pandigital, 192384576. We will call 192384576 the concatenated product of 192 and (1,2,3)
   *
   * The same can be achieved by starting with 9 and multiplying by 1, 2, 3, 4, and 5, giving the pandigital, 918273645, which is the concatenated product of 9 and (1,2,3,4,5)
   *
   * @question What is the largest 1 to 9 pandigital 9-digit number that can be formed as the concatenated product of an integer with (1,2, ... , n) where n > 1?
   * @guide
   * We are given that the answer is >= 918273645
   * 
   * If our multiplicand (in the example of the question the multiplicand would be 192) has two digits, then it must be >= 91, since our answer >= 918273645.
   * Successive multiplication by 1, 2, 3, 4 will yield products of 2 digits, 3 digits, 3 digits, 3 digits = 11 digits > 9 digits.
   * 
   * We can apply the same logic to 3 digit multiplicands: 3 + 4 + 4 > 9
   * 
   * For 5 digits and above, the result of multipliying by 1 and 2 will result (respectively) in a >5 and >6 digit number => > 9 digits
   * 
   * So we can only check 4-digits multiplicands where m * 1 has 4 digits and m * 2 has 5 digits, 4 + 5 = 9.
   * we dont have to check numbers > 9500 as multipliying by 2 will yield 19..., and the number will contain 2 9's, and won't be pandigital.
   */
  e38() {
    let largestPandigitalProduct = 918273645;
    for (let m = 9182; m <= 9487; m++) {
      const multiplicandArr = m.toString().split('');
      const mHasDuplicate = multiplicandArr.length !== (new Set(multiplicandArr)).size;
      if (!mHasDuplicate) {
        const product = m * 100000 + 2 * m; // eg. 9182 -> 918200000 + 18364 -> 918218364

        // check if product is pandigital
        const productArr = product.toString().split('');
        const hasDuplicate = productArr.length !== (new Set(productArr)).size;
        if (!hasDuplicate && !productArr.includes('0')) {
          largestPandigitalProduct = +(`${product}`);
        }
      }
    }
    return largestPandigitalProduct;
  },

  /**
   * Problem 39: Integer right triangles
   * If p is the perimeter of a right angle triangle with integral length sides, {a,b,c}, there are exactly three solutions for p = 120.
   *
   * {20,48,52}, {24,45,51}, {30,40,50}
   *
   * @question For which value of p ≤ 1000, is the number of solutions maximised?
   * @guide
   * We generate each primitive triplet one by one, then we multiply the perimeter by integer multiples to get its non-primitive triplets.
   * For example, (3,4,5) is a primitive triplet, but (6,8,10) is not.
   * In a table, we store as the keys the perimeter, and we store as the values the number of solutions for that perimeter.
   * So starting with m = 2, n = 1, we get a perimeter of 12.
   * We multiply that perimeter until it is close to 1000, and so our table will look like { 12: 1, 24: 1, ..., 996: 1 }
   * We then go to the next primitive solution, and repeat, until the tables is filled with multiples of all primitive solutions.
   * The key-value pair with the largest value will be the perimeter with the most solutions.
   */
  e39() {
    // we can generate all unique primitive pythagorean triples given a pair of integers m, n:
    // a = m^2 - n^2, b = 2mn, c = m^2 + n^2, where:
    // 1. m > n > 0
    // 2. m and n must not both be odd
    // 3. m and n must be coprime:

    // so we have perimeter = a+b+c = 2m^2 + 2mn = 2m(m+n)

    // we just generate each m, n pair and increment the value associated with p
    // then we also increment each multiple of the generated perimeter
    const perimeters = {};

    let maximizedPerimeter = 12;
    let maximizedPerimeterSolutionsCount = 0;

    // we can quickly check that in order to satisfy p <= 1000, m <= 23
    for (let m = 2; m <= 23; m++) {
      for (let n = 1; n < m; n++) {
        if ((utils.isEven(m) || utils.isEven(n)) && utils.isCoprime(m, n)) {
          const primitivePerimeter = 2 * m * (m + n);
          let multiple = 1;
          let multipliedPerimeter = primitivePerimeter * multiple;
          while (multipliedPerimeter <= 1000) {
            perimeters[multipliedPerimeter] = (perimeters[multipliedPerimeter] || 0) + 1;
            const perimeterSolutionsCount = perimeters[multipliedPerimeter];
            if (perimeterSolutionsCount > maximizedPerimeterSolutionsCount) {
              maximizedPerimeterSolutionsCount = perimeterSolutionsCount;
              maximizedPerimeter = multipliedPerimeter;
            }
            multiple++;
            multipliedPerimeter = primitivePerimeter * multiple;
          }
        }
      }
    }
    return maximizedPerimeter;
  },

  /**
   * Problem 40: Champernowne's constant
   * An irrational decimal fraction is created by concatenating the positive integers:
   *
   * 0.12345678910[1]112131415161718192021...
   *
   * It can be seen that the 12th digit of the fractional part is 1 (enclosed in square brackets []).
   *
   * @question If d_n represents the nth digit of the fractional part, find the value of the following expression.
   *
   * @question d_1 × d_10 × d_100 × d_1000 × d_10000 × d_100000 × d_1000000
   * @guide
   * We split the fractional part into sections.
   * The first section contains the numbers with one digit (1,2,3,...,9). 9 digits
   * The second section contains the 2-digits numbers (10,11,12,...,99). 180 digits
   * The third section contains the 2-digits numbers (100,101,102,...,999). 2700 digits
   * The sections after will contain 36000, 450000, and 5400000 digits.
   * So we first find the section, then we find the number in the section, and finally the digit in the number.
   */
  e40() {
    const searchIndexes = [1, 10, 100, 1000, 10000, 100000, 1000000];
    const foundDigits = searchIndexes.map(x => champernowne(x));

    function champernowne(index) {
      // it can be seen that each section contains 9i * 10^(i-1) digits total
      let countSectionNumbers = section => 9 * section * 10 ** (section - 1);

      // first find section
      let section = 1;
      while (countSectionNumbers(section) < index) {
        section++;
      }
      
      for (let i = 1; i < section; i++) {
        index -= countSectionNumbers(i);
      }
      
      // find number in section
      let nth = Math.floor(index / section);
      if (section > 1) {
        nth += 10 ** (section - 1)
      }

      // find digit in number
      let nthdigit = (index - 1) % section; // have to substract by 1 because 0th index is actually the first digit, etc.
      return nth.toString().split('')[nthdigit]
    }

    return foundDigits.reduce((a, c) => a * c, 1);
  },
};
