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
   */
  e5() {
    const totalPrimeFactors = [];
    // for each n, we:
    // (1) compute its prime factorization (see function below)
    // (2) "merge" that factorization into totalPrimeFactors by checking if the computed power
    // is higher than the power already in the array
    // (3) after all merging is done, the totalPrimeFactors will contain the prime factorization of our answer
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

    return totalPrimeFactors.reduce((acc, power, base) => { // (3)
      // by definition of totalPrimeFactors, the indexes represent the bases of the prime factorization
      return power ? acc * (base ** power) : acc;
    }, 1);
  },

  /**
   * Problem 6: Sum square difference
   * @question Find the difference between the sum of the squares of the first one hundred natural numbers and the square of the sum.
   */
  e6() {
    let difference = 0;
    for (let i = 0; i <= 100; i++) {
      // let s_i = 1 + 2 + ... + i-1 + i
      // let S_i = 1^2 + 2^2 + ... + (i-1)^2 + i^2
      // let d_i = s_i^2 - S_i = (s_(i-1) + i)^2 - S_i
      // = s_(i-1)^2 + 2i*s_(i-1) + i^2 - S_(i-1) - i^2
      // = s_(i-1)^2 - S_(i-1) + 2i*s_(i-1) + i^2 - i^2
      // = d_(i-1) + 2i * i(i-1)/2 = d_(i-1) + i^2(i-1)
      difference += (i ** 2) * (i - 1);
    }
    return difference;
  },

  /**
   * Problem 7: 10001st prime
   * @question What is the 10001st prime number?
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
   */
  e8() {
    const data8 = require('./p8_data');
    const formattedNumber = data8.replace(/\r|\n|\s/g, ''); // one line of string
    // if 12 or less digits are wrapped between two 0s, we can collapse it
    const slimNumber = formattedNumber.replace(/0\d{0,12}0/g, '0');
    // initial product
    let largestProduct = slimNumber.substr(0, 13).split('').reduce((acc, curr) => acc * Number(curr), 1);
    // initial digit
    let previousDigit = 7;
    let newProduct;
    for (let i = 1; i < slimNumber.length - 13; i++) {
      // if our substring contains an 0, we can skip it
      if (!slimNumber.substr(i, 13).includes('0')) {
        // since each iteration have 12 digits in common with the previous iteration
        // we use our previously computed product, divide the digit that came before it,
        // and multiply the digit that comes after
        if (slimNumber[i - 1] === '0') { // make sure we don't divide by 0
          newProduct = slimNumber.substr(i, 13).split('').reduce((acc, curr) => acc * Number(curr), 1);
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
   */
  e9() {
    // given m > n > 0
    // we can generate: a = m^2-n^2, b = 2mn, c = m^2+n^2 (euclid)
    // a+b+c = 1000 => 2m(m+n) = 1000 => m(m+n) = 500;
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
   *  @question Find the sum of all the primes below two million.
   */
  e10() {
    // we use the Sieve of Eratosthenes to generate all primes below two million
    // for this purpose we create an array where the indexes represent integers,
    // and the values represent whether the index is prime or not
    // however, to optimize speed, we only sieve by odd multiples, ie. the even numbers are assumed to be non-prime

    // the resulting sieveArr will contain a list of flags indicating
    // whether the odd number corresponding to that index is prime or not
    // e.g. sieveArr[3] = true -> meaning that the 3rd odd number (excluding 1, so 7) is prime
    // e.g. sieveArr[4] = false -> 9 is not prime
    const sieveArr = [];
    // we can stop at root because all the composite numbers above it must have been crossed out
    // this is because all composite numbers above root must have a factor smaller than root
    // because if a composite number have only factors above root, then that composite number must be > 2 million
    const root = Math.sqrt(2000000);
    for (let i = 1; i < root; i++) {
      if (sieveArr[i] !== false) { // if index is not already sieved
        sieveArr[i] = true; // then it must be prime
        // since the indexes represent the odd numbers, we only need to sieve up to a multiple(j) such that:
        // (ith odd number) * j < 2000000 => (2*i+1)*j < 2000000 => i * j < 2000000/(2*i+1)
        const sieveTo = 2000000 / (2 * i + 1);
        // sieve all odd multiples of i
        // e.g. let i = 3 -> we must sieve 9, 15, 21, ...
        // therefore we sieve their corresponding indexes -> 4, 7, 10, ...
        for (let j = 3; j <= sieveTo; j += 2) {
          sieveArr[((2 * i + 1) * j - 1) / 2] = false;
        }
      }
    }
    let sum = 0;
    // after the array is ready, we loop over it adding all flags which are true,
    // keeping in mind that the p is the pth odd integer
    for (let p = 1; p < sieveArr.length; p++) {
      if (sieveArr[p] !== false) {
        sum += (2 * p + 1);
      }
    }
    // add 2 because 2 is the only even prime!
    return sum + 2;
  },
};
