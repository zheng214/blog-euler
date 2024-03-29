
const fs = require('fs');
const path = require('path');
const utils = require('../utils');

module.exports = {
  /**
   * Problem 41: Pandigital prime
   * We shall say that an n-digit number is pandigital if it makes use of all the digits 1 to n exactly once.
   *
   * For example, 2143 is a 4-digit pandigital and is also prime.
   *
   * @question What is the largest n-digit pandigital prime that exists?
   * @guide
   * We don't need to check 9-digit numbers, as the sum of the digits is 45, which makes the number divisible by 3. We can apply the same logic to 8 digit numbers.
   */
  e41() {
    const digits = [7, 6, 5, 4, 3, 2, 1];

    // we don't need to check if the number is prime if the finalDigit is 2, 4, 5, or 6
    const validFinalDigits = [1, 3, 7];

    // we search from n = 7 to n = 4 (given in problem statement)
    for (let n = 7; n >= 4; n--) {
      const validDigits = digits.slice(7 - n);
      // here i represents the ith lexicographic permutation
      for (let i = 1; i <= utils.fact(n); i++) {
        const pandigitalArray = utils.getLexicalPermutation(validDigits, i);
        const finalDigit = pandigitalArray[pandigitalArray.length - 1];
        if (validFinalDigits.includes(+(finalDigit))) {
          const pandigitalNumber = +(pandigitalArray.join(''));
          if (utils.isPrime(pandigitalNumber)) {
            return pandigitalNumber;
          }
        }
      }
    }
  },

  /**
   * Problem 42: Coded Triangle numbers
   *
   * The nth term of the sequence of triangle numbers is given by, tn = ½n(n+1); so the first ten triangle numbers are:
   *
   * 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, ...
   *
   * By converting each letter in a word to a number corresponding to its alphabetical position and adding these values we form a word value. For example, the word value for SKY is 19 + 11 + 25 = 55 = t10. If the word value is a triangle number then we shall call the word a triangle word.
   *
   * @question Using [p042_words.txt @asset p042_words.txt], a 16K text file containing nearly two-thousand common English words, how many are triangle words?
   * @guide
   * Very straightforward, we go through the list of words and check if each word is triangle.
   */
  e42() {
    // we can assume that a word cannot exceed the word value of 500 (almost 20 consecutive 'z')
    // we generate a table of triangle numbers up to 500
    let triangleWords = 0;
    const triangleTable = utils.generateTriangulars(500);
    const words = fs.readFileSync(path.join(__dirname, 'p042_words.txt'))
      .toString()
      .replace(/"/g, '')
      .split(',');
    words.forEach((word) => {
      const wordValue = utils.sumArray(word.split(''), char => char.charCodeAt(0) - 64);
      if (triangleTable[wordValue]) {
        triangleWords++;
      }
    });
    return triangleWords;
  },

  /**
   * Problem 43 Sub-string divisibility
   *
   * The number, 1406357289, is a 0 to 9 pandigital number because it is made up of each of the digits 0 to 9 in some order, but it also has a rather interesting sub-string divisibility property.
   *
   * Let d1 be the 1st digit, d2 be the 2nd digit, and so on. In this way, we note the following:
   *
   * d2d3d4=406 is divisible by 2
   *
   * d3d4d5=063 is divisible by 3
   *
   * d4d5d6=635 is divisible by 5
   *
   * d5d6d7=357 is divisible by 7
   *
   * d6d7d8=572 is divisible by 11
   *
   * d7d8d9=728 is divisible by 13
   *
   * d8d9d10=289 is divisible by 17
   *
   * @question Find the sum of all 0 to 9 pandigital numbers with this property.
   * @guide
   * Our algorithm is as follows:
   * 1. start by picking the last 3 digits such that it is divisible by 17, ie. 017, 034, ...
   * 2. we then pick d7 such that d7d8d9 is divisible by 13, if such d7 does not exist, we go to the next multiple of 17
   * 3. if it does exist, we pick d6 s.t. d6d7d8 is divisible by 11, etc.
   * 4. repeat until we find d2d3d4 s.t. it is divisible by 2.
   */
  e43() {
    const subdivisibleNumbers = [];
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    // 58 * 17 = 986, largest 3-digit number which is divisible by 17
    for (let i = 1; i <= 58; i++) {
      const last3 = (i * 17).toString().padStart(3, '0'); // 1 -> '017', 2 -> '034, etc
      if (!utils.containsDuplicate(last3)) {
        buildNumber(
          last3,
          digits.filter(x => !last3.includes(x)),
          [2, 3, 5, 7, 11, 13],
        );
      }
    }

    // recursively build a number digit by digit, ensuring divisibility at each step
    function buildNumber(acc, remainingDigits, remainingDividers) {
      if (!remainingDividers.length) {
        return subdivisibleNumbers.push(`${remainingDigits[0]}${acc}`);
      }
      const divider = remainingDividers.pop();
      for (let j = 0; j < remainingDigits.length; j++) {
        const leadingDigit = remainingDigits[j];
        const trailingDigits = +acc.slice(0, 2);
        const numToCheck = leadingDigit * 100 + trailingDigits;
        if (numToCheck % divider === 0) {
          buildNumber(
            `${leadingDigit}${acc}`,
            [...remainingDigits].filter(x => x !== leadingDigit),
            [...remainingDividers],
          );
        }
      }
    }
    return utils.sumArray(subdivisibleNumbers, x => +x);
  },

  /**
   * Problem 44 Pentagon numbers
   *
   * Pentagonal numbers are generated by the formula, Pn=n(3n−1)/2. The first ten pentagonal numbers are:
   *
   * 1, 5, 12, 22, 35, 51, 70, 92, 117, 145, ...
   *
   * It can be seen that P4 + P7 = 22 + 70 = 92 = P8. However, their difference, 70 − 22 = 48, is not pentagonal.
   *
   * @question Find the pair of pentagonal numbers, Pj and Pk, for which their sum and difference are pentagonal and D = |Pk − Pj| is minimized; what is the value of D?
   * @guide
   * We loop through each pentagonal number Pk, and for each Pk loop through each Pj smaller than Pk
   * We check whether Pk - Pj AND Pk + Pj is pentagonal, if so return the difference
   */
  e44() {
    let k = 2;
    while (true) {
      const Pk = pentg(k);
      let j = k;
      while (j >= 1) {
        const Pj = pentg(j);
        if (utils.isPentagonal(Pk - Pj) && utils.isPentagonal(Pk + Pj)) {
          return Pk - Pj;
        }
        j--;
      }
      k++;
    }

    function pentg(n) {
      return ((3 * (n ** 2)) - n) / 2;
    }
  },

  /**
   * Problem 45 Triangular, pentagonal, and hexagonal
   * Triangle, pentagonal, and hexagonal numbers are generated by the following formulae:
   *
   * Triangle T(n)=n(n+1)/2: 1, 3, 6, 10, 15, ...
   *
   * Pentagonal P(n)=n(3n−1)/2: 1, 5, 12, 22, 35, ...
   *
   * Hexagonal H(n)=n(2n−1): 1, 6, 15, 28, 45, ...
   *
   * It can be verified that T(285) = P(165) = H(143) = 40755.
   *
   * @question Find the next triangle number that is also pentagonal and hexagonal.
   * @guide
   * We go through each hexagonal number until we find one that is both pentagonal and triangle.
   */
  e45() {
    let h = 144;
    while (true) {
      const hexagonal = hexg(h);
      if (utils.isPentagonal(hexagonal) && utils.isTriangular(hexagonal)) {
        return hexagonal;
      }
      h++;
    }
    function hexg(n) {
      return (n * ((2 * n) - 1));
    }
  },

  /**
   * Problem 46 Goldbach's other conjecture
   * It was proposed by Christian Goldbach that every odd composite number can be written as the sum of a prime and twice a square.
   *
   * 9 = 7 + 2×1²
   *
   * 15 = 7 + 2×2²
   *
   * 21 = 3 + 2×3²
   *
   * 25 = 7 + 2×3²
   *
   * 27 = 19 + 2×2²
   *
   * 33 = 31 + 2×1²
   *
   * It turns out that the conjecture was false.
   *
   * @question What is the smallest odd composite that cannot be written as the sum of a prime and twice a square?
   * @guide
   * We check each odd number for primality; if it is composite, check for conjecture validity.
   */
  e46() {
    let num = 9;
    while (true) {
      if (!utils.isPrime(num)) {
        if (!conjValid(num)) {
          return num;
        }
      }
      num += 2;
    }

    // determines whether a number is valid for Goldbach's conjecture
    function conjValid(n) {
      const rootUB = Math.sqrt((n - 2) / 2);
      for (let i = 1; i <= rootUB; i++) {
        const twiceSquare = (i ** 2) * 2;
        if (utils.isPrime(n - twiceSquare)) {
          return true;
        }
      }
      return false;
    }
  },

  /**
   * Problem 47 Distinct primes factors
   * The first two consecutive numbers to have two distinct prime factors are:
   *
   * 14 = 2 × 7
   *
   * 15 = 3 × 5
   *
   * The first three consecutive numbers to have three distinct prime factors are:
   *
   * 644 = 2² × 7 × 23
   *
   * 645 = 3 × 5 × 43
   *
   * 646 = 2 × 17 × 19.
   *
   * @question Find the first four consecutive integers to have four distinct prime factors each. What is the first of these numbers?
   * @guide
   * Starting with the smallest number, <code>first</code>, which has 4 distinct prime factors(DPF), 2 * 3 * 5 * 7, we check if the next 3 consecutive number also has 4 DPF.
   * If yes, we found our solution, if not, we increment <code>first</code>.
   */
  e47() {
    // assume for now that we don't need prime factors over 1000
    const first1000Primes = Object.keys(utils.generatePrimesTable(1000));
    let first = 2 * 3 * 5 * 7;
    while (first < 1000000) {
      const second = first + 1;
      const third = first + 2;
      const fourth = first + 3;
      if (isDPFValid(first)) {
        if (isDPFValid(second)) {
          if (isDPFValid(third)) {
            if (isDPFValid(fourth)) {
              return first;
            } // if the fourth number is not valid, skip over the next four numbers
            first += 4;
          } else { // if the third number is not valid, skip over the next 3 numbers, etc.
            first += 3;
          }
        } else {
          first += 2;
        }
      } else {
        first++;
      }
    }

    // we implement a tailored function which returns true iff n has exactly 4 distinct prime factors
    function isDPFValid(n) {
      let quotient = n;
      let DPFCount = 0;
      for (let primeIndex = 0; primeIndex < first1000Primes.length; primeIndex++) {
        const primeFactor = first1000Primes[primeIndex];
        if (primeFactor > quotient) {
          return DPFCount === 4;
        }
        if (quotient % primeFactor === 0) {
          DPFCount++;
        }
        while (quotient % primeFactor === 0) {
          if (DPFCount > 4) {
            return false;
          }
          quotient /= primeFactor;
        }
      }
    }
  },

  /**
   * Problem 48 Self powers
   * The series, 1¹ + 2² + 3³ + ... + 10¹⁰ = 10405071317.
   *
   * @question Find the last ten digits of the series, 1¹ + 2² + 3³ + ... + 1000¹⁰⁰⁰.
   * @guide
   * For each number, we only need to keep track of the last ten digits. For example, when calculating 32³², we iteratively multiply the last ten digits by 32, and keep the last 10 digits of the result, instead of computing the whole number.
   */
  e48() {
    let result = 0;
    for (let i = 1; i <= 1000; i++) {
      result = getLast10Digits(result) + getSelfPower(i);
    }
    return result;

    function getSelfPower(n) {
      // returns the last 10 digits of n^n
      if (n % 10 === 0) {
        // if n = 10 * k, then n^n = (k*10)^(k*10) = (k*10)^k * 10^(k*10) = C * 10^(k*10)
        // => last 10 digits will be 0s
        return 0;
      }
      return [...Array(n - 1)].reduce(acc => getLast10Digits(acc) * n, n);
    }

    function getLast10Digits(n) {
      // returns the last 10 digits of a number
      return +n.toString().slice(-10);
    }
  },

  /**
   * Problem 49 Prime permutations
   *
   * The arithmetic sequence, 1487, 4817, 8147, in which each of the terms increases by 3330, is unusual in two ways:
   *
   * (i) each of the three terms are prime, and,
   *
   * (ii) each of the 4-digit numbers are permutations of one another.
   *
   * @question There are no arithmetic sequences made up of three 1-, 2-, or 3-digit primes, exhibiting this property, but there is one other 4-digit increasing sequence. What 12-digit number do you form by concatenating the three terms in this sequence?
   * @guide
   * The comments in the code explains how the search is performed.
   */
  e49() {
    // we generate all primes under 10000,
    // for each prime generated we sort their digits from lower to higher, and classify them in a table

    // Equivalence Class table, the key represents the equivalence class number (e.g 1478)
    // And the value will be the list of primes in that equivalence class, ie. the list of primes which also uses those 4 digits.
    // e.g. for 1478, the value will be [ '1487', '1847', '4817', '4871', '7481', '7841', '8147', '8741' ]
    const permutationClassTable = {};
    const fourDigitPrimes = Object.keys(utils.generatePrimesTable(10000)).filter(x => x >= 1000);
    for (let i = 0; i < fourDigitPrimes.length; i++) {
      const sortedDigits = fourDigitPrimes[i].toString().split('').sort().join('');
      const permutations = permutationClassTable[sortedDigits];
      if (permutations) {
        permutationClassTable[sortedDigits].push(fourDigitPrimes[i]);
      } else {
        permutationClassTable[sortedDigits] = [fourDigitPrimes[i]];
      }
    }

    // now that we have our equivalence class table
    // we loop over the keys and for each key, we check the list of corresponding primes
    // for whether or not one number is the average of 2 other numbers
    const keys = Object.keys(permutationClassTable);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key !== '1478') { // this answer is given in problem statement
        const primes = permutationClassTable[key];
        if (primes.length >= 3) {
          for (let j = 0; j < primes.length - 2; j++) {
            for (let k = j + 2; k < primes.length; k++) {
              const avg = (+primes[j] + +primes[k]) / 2;
              if (primes.includes(avg.toString())) {
                return `${primes[j]}${avg}${primes[k]}`;
              }
            }
          }
        }
      }
    }
  },

  /**
   * Problem 50 Consecutive prime sum
   * The prime 41, can be written as the sum of six consecutive primes:
   *
   * 41 = 2 + 3 + 5 + 7 + 11 + 13
   *
   * This is the longest sum of consecutive primes that adds to a prime below one-hundred.
   *
   * The longest sum of consecutive primes below one-thousand that adds to a prime, contains 21 terms, and is equal to 953.
   *
   * @question Which prime, below one-million, can be written as the sum of the most consecutive primes?
   * @guide
   * Guide is in the code comments.
   */
  e50() {
    // we begin by generating the list of primes under 1 million
    const primesTable = utils.generatePrimesTable(1000000);
    const primesList = Object.keys(primesTable).map(x => +x);
    // next we determine the upper bound for the number of consecutive primes s.t. their sum does not exceed one million
    const upperConsec = [...primesList].reduce(
      (sum, curr, i, arr) => {
        if (sum >= 1000000) {
          // if sum exceeds one million, returns the number of terms and exit from the reducer
          arr.splice(1);
          return i;
        }
        return sum + curr;
      },
    ); // spoiler: the upper bound is 547, ie. if you try to add 548 primes, their sum will always exceed one million.

    let largestSum = 0;

    // t := number of terms in the sum
    // for each t, we sum t consecutive primes and check if their sum is also prime
    // if it is we store that number and continue checking for the current t
    // once we are done we just return the largest sum obtained at the current t
    for (let t = upperConsec; t >= 21; t--) {
      let j = 0;
      let sum = utils.sumArray(primesList.slice(j, j + t));
      while (sum < 1000000) {
        if (primesTable[sum] && sum > largestSum) {
          largestSum = sum;
        }
        j++;
        sum = utils.sumArray(primesList.slice(j, j + t));
      }
      if (largestSum > 0) {
        return largestSum;
      }
    }
  },
};
