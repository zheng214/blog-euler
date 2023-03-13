const utils = require('../utils');

// <span class="mono"></span>
module.exports = {
  /**
   * Problem 1: Multiples of 3 and 5
   * @question Find the sum of all the multiples of 3 or 5 below 1000.
   * @guide
   * We add all multiples of 3 and 5, and substract multiples of 15 since these are counted twice.
   */
  e1() {
    const sum3 = 3 * (333 * 334) / 2; // 3(1 + 2 + ... + 333)
    const sum5 = 5 * (199 * 200) / 2; // 5(1 + 2 + ... + 199)
    const sum15 = 15 * (66 * 67) / 2; // 15(1 + 2 + ... + 66)
    return sum3 + sum5 - sum15;
  },

  /**
   * Problem 2: Even Fibonacci numbers
   * @question Find the sum of the even-valued Fibonacci numbers whose values do not exceed four million.
   * @guide
   * Very straightforward, just go through all Fibonacci numbers and add the even ones.
   */
  e2() {
    let [a, b] = [0, 1];
    let result = 0;
    while (a < 4000000) {
      [a, b] = [b, a + b];
      if (!utils.isOdd(a)) {
        result += a;
      }
    }
    return result;
  },

  /**
   * Problem 3: Largest prime factor
   * @question What is the largest prime factor of the number 600851475143.
   * @guide
   * <span>Starting with the given number (<span class="mono">currentlyDividing</span>), and the factor 2 (<span class="mono">currentFactor</span>), we divide the given number by the factor until it is not divisible by it anymore.</span>
   * <span>We then increment <span class="mono">currentFactor</span>, and repeat, until the given number equals 1.</span>
   */
  e3() {
    let currentlyDividing = 600851475143;
    let currentFactor = 2;
    // for each currentFactor,
    // we keep dividing the current number by it until it is incapable of doing so
    while (currentlyDividing > 1) {
      while (currentlyDividing % currentFactor === 0) {
        currentlyDividing /= currentFactor;
      }
      if (currentlyDividing === 1) break;
      currentFactor++;
    }
    return currentFactor;
  },

  /**
   * Problem 4: Largest palindrome product
   * The largest palindrome made from the product of two 2-digit numbers is 9009 = 91 × 99.
   * @question Find the largest palindrome made from the product of two 3-digit numbers.
   * @guide
   * Starting with the largest possible number 999999, we iterate through the list of palindromes from biggest to smallest. This is achieved by decrementing 3 digit numbers from 999 and appending its flipped counterpart (ie. 999999, 998899, 997799, ...). For each palindrome, we test whether it is divisible by a 3 digit number, using the <span class="mono">isPalindromeValid</span> function.
   * <br /><br />
   * The function first calculates the square root of the palindrome. If the palindrome is valid, it must have a divisor bigger than the square root AND a divisor smaller than the square root.
   * For small optimization purposes, if the square root is closer to 100, we search all 3 digit numbers between the square root and 100, Otherwise, we search all 3 digit numbers between the square root and 999.
   */
  e4() {
    // searching 6 digits palindromes
    for (let n = 999; n > 100; n--) {
      const reversedNumString = n.toString().split('').reverse().join('');
      const palindrome = Number(`${n.toString()}${reversedNumString}`);
      if (isPalindromeValid(palindrome)) {
        return palindrome;
      }
    }

    // searching 5 digits palindromes
    for (let m = 99; m > 10; m--) {
      for (let k = 9; k >= 0; k--) {
        const reversedNumString = m.toString().split('').reverse().join('');
        const palindrome = Number(`${m.toString()}${k}${reversedNumString}`);
        if (isPalindromeValid(palindrome)) {
          return palindrome;
        }
      }
    }

    return 'no palindromes found';

    // test whether a palindrome is divisible by a three digit number
    function isPalindromeValid(palindrome) {
      const isValidDivisor = n => Number.isInteger(n) && n >= 100 && n <= 999;
      const centerQuotient = Math.sqrt(palindrome);
      if (Number.isInteger(centerQuotient)) {
        return true;
      }
      // determine the search direction based on whether the square root is closer to 100 or 999
      let searchDirection;
      if (centerQuotient < 550) {
        searchDirection = 'down';
      } else {
        searchDirection = 'up';
      }

      let currentDivisor = searchDirection === 'up'
        ? Math.ceil(centerQuotient)
        : Math.floor(centerQuotient);

      do {
        if (isValidDivisor(palindrome / currentDivisor)) {
          return true;
        }
        if (searchDirection === 'up') {
          currentDivisor++;
        } else {
          currentDivisor--;
        }
      } while (isValidDivisor(currentDivisor));
      return false;
    }
  },

  /**
   * Problem 5: Smallest multiple
   * 2520 is the smallest number that can be divided by each of the numbers from 1 to 10 without any remainder.
   * @question What is the smallest positive number that is evenly divisible by all of the numbers from 1 to 20?
   * @guide
   * The algorithm works as follows:
   * <br />
   * For each number 2, 3, ..., 20.
   * <br />
   * We extract its prime factorization. (eg. 12 -> 2^2 * 3^1, 18 -> 2^1 * 3^2)
   * <br />
   * We add that factorization to the table <span class="mono">totalPrimeFactors</span>. 
   * <br />
   * The table <span class="mono">totalPrimeFactors</span> is encoded such that the keys are the bases, and the entries are the exponents.
   * <br />
   * So, going from 2 to 20, iteratively, the array will update as follows:
   * <br />
   * <span class="mono">{ 2: 1 }</span> (2 = 2^1)
   * <br />
   * <span class="mono">{ 2: 1, 3: 1 }</span> (3 = 3^1)
   * <br />
   * <span class="mono">{ 2: 2, 3: 1 }</span> (4 = 2^2)
   * <br />
   * <span class="mono">{ 2: 2, 3: 1, 5: 1 }</span> (5 = 5^1)
   * <br />
   * <span class="mono">{ 2: 2, 3: 1, 5: 1 }</span> (6 = 2^1 * 3^1) Note that nothing has changed, since 2^1 and 3^1 are already part of the array.
   * <br />
   * <span class="mono">{ 2: 2, 3: 1, 5: 1, 7: 1 }</span> (7 = 7^1)
   * <br />
   * <span class="mono">{ 2: 3, 3: 1, 5: 1, 7: 1 }</span> (8 = 2^3)
   * <br />
   * etc.
   * <br />
   * At each step, the product of the bases, raised to their respective exponents, will be the least common multiple of all numbers from 2 to the number inserted at that step. 
   * After the 20th step (we start with step 2), the array will have the information of the least common multiple of all numbers from 2 to 20.
   */
  e5() {
    const totalPrimeFactors = {};
    for (let n = 2; n <= 20; n++) {
      const primeFactors = utils.listPrimeFactors(n); // (1)
      // we start at 2 since the first two elements are always empty
      for (let factor = 2; factor < primeFactors.length; factor++) {
        const computedPower = primeFactors[factor];
        const existingPower = totalPrimeFactors[factor];
        if (computedPower && (!existingPower || computedPower > existingPower)) { // (2)
          totalPrimeFactors[factor] = primeFactors[factor];
        }
      }
    }

    return Object.keys(totalPrimeFactors).reduce((acc, power) => { // (3)
      // by definition of totalPrimeFactors, the indexes represent the bases of the prime factorization
      return acc * (power ** totalPrimeFactors[power]);
    }, 1);
  },

  /**
   * Problem 6: Sum square difference
   * @question Find the difference between the sum of the squares of the first one hundred natural numbers and the square of the sum.
   * @guide
   * Pretty self-explanatory
   */
  e6() {
    let sum1to100 = 0;
    let sumOfsquares = 0;
    for (let i = 0; i <= 100; i++) {
      sum1to100 += i;
      sumOfsquares += (i ** 2);
    }
    return sum1to100 ** 2 - sumOfsquares;
  },

  /**
   * Problem 7: 10001st prime
   * @question What is the 10001st prime number?
   * @guide
   * Check each number 1 by 1, if it's prime we increment our counter, until our counter becomes 10001. The prime checker function is linked below.
   */
  e7() {
    let number = 1;
    let nthPrime = 0;
    while (nthPrime < 10001) {
      number++;
      if (utils.isPrime(number)) {
        nthPrime++;
      }
    }
    return number;
  },

  /**
   * Problem 8: Largest product in a series
   * @question Find the thirteen adjacent digits in the [1000-digit number @asset 'p8_data.txt'] that have the greatest product.
   * @guide
   * We start out by "slimming" our input. If 12 or less digits are wrapped between two 0s, we can collapse it down to a single 0.
   * <br />
   * Then, for each step, we "move" to the right, and, instead of multiplying all 13 numbers, we divide by the leftmost number and multiply by the rightmost number.
   */
  e8() {
    const data8 = require('./p8_data');
    const formattedNumber = data8.replace(/\r|\n|\s/g, ''); // one line of string
    // if 12 or less digits are wrapped between two 0s, we can collapse it
    const slimNumber = formattedNumber.replace(/0\d{0,12}0/g, '0');
    // initial product
    let largestProduct = slimNumber.substring(0, 13).split('').reduce((acc, curr) => acc * Number(curr), 1);
    // initial digit
    let previousDigit = 7;
    let newProduct;
    for (let i = 1; i < slimNumber.length - 13; i++) {
      // if our substring contains an 0, we can skip it
      if (!slimNumber.substring(i, i + 13).includes('0')) {
        // since each iteration have 12 digits in common with the previous iteration
        // we use our previously computed product, divide the digit that came before it,
        // and multiply the digit that comes after
        if (slimNumber[i - 1] === '0') { // make sure we don't divide by 0
          newProduct = slimNumber.substring(i, i + 13).split('').reduce((acc, curr) => acc * Number(curr), 1);
        } else {
          newProduct = newProduct / previousDigit * Number(slimNumber[i + 12]);
        }
        previousDigit = Number(slimNumber[i]);
        if (newProduct > largestProduct) {
          largestProduct = newProduct;
        }
      }
    }
    return largestProduct;
  },

  /**
   * Problem 9: Special Pythagorean triplet
   * @question There exists exactly one Pythagorean triplet for which a + b + c = 1000. Find the product abc.
   * @guide
   * There is a formula for generating Pythagorean triplets from 2 numbers m > n > 0: 
   * <br />
   * a = m^2-n^2, b = 2mn, c = m^2+n^2 (euclid)
   * <br />
   * We use simple algebra to find the following: a+b+c = 1000 => 2m(m+n) = 1000 => m(m+n) = 500; (ie. we must find 2 numbers, m and n, such that m(m+n) = 500)
   * <br />
   * Since m(m+n) = 500, we can observe that m < sqrt(500). So we search m by decrementing from sqrt(500).
   */
  e9() {
    let m = Math.floor(Math.sqrt(500));
    while (m > 1) {
      const quotient = 500 / m;
      const n = quotient - m;
      if (Number.isInteger(n) && Number.isInteger(m) && m > n) {
        return ((m ** 2) - (n ** 2)) * (2 * m * n) * ((m ** 2) + (n ** 2)); // a * b * c
      }
      m--;
    }
    return 0;
  },

  /**
   * Problem 10: Summation of primes
   * @question Find the sum of all the primes below two million.
   * @guide
   * We use our built-in function to generate the list of primes below 2 million, and add them. The function is linked below.
   */
  e10() {
    const primes = utils.generatePrimesTable(2000000);
    return utils.sumArray(Object.keys(primes), n => +n);
  },
};
