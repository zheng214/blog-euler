
const fs = require('fs');
const path = require('path');
const utils = require('../utils');

module.exports = {
  /**
   * Problem 71 Ordered fractions
   *
   * Consider the fraction, n/d, where n and d are positive integers.
   *
   * If n<d and HCF(n,d)=1, it is called a reduced proper fraction.
   *
   * If we list the set of reduced proper fractions for d ≤ 8 in ascending order of size, we get:
   *
   * 1/8, 1/7, 1/6, 1/5, 1/4, 2/7, 1/3, 3/8, 2/5, 3/7, 1/2, 4/7, 3/5, 5/8, 2/3, 5/7, 3/4, 4/5, 5/6, 6/7, 7/8
   *
   * It can be seen that 2/5 is the fraction immediately to the left of 3/7.
   *
   * @question By listing the set of reduced proper fractions for d ≤ 1,000,000 in ascending order, find the numerator of the fraction immediately to the left of 3/7.
   */
  e71() {
    // for each d <= 1,000,000, we just need to find maximal integer c such that c/d is smaller than 3/7
    // we accomplish this by multiplying d by 3/7, and taking the floor of the result
    // if the result is divisible by the floor of the result, we can skip to the next d
    // if not, the difference between the result and the floor of the result is indicative of how close the result is to 3/7
    // ie we want to minimize (d * 3/7 - floor(d * 3/7))/d
    const FRACTION = 3 / 7;
    let smallestDiff = 1;
    const answer = {};
    for (let d = 1; d <= 1000000; d++) {
      if (d % 7 === 0) {
        continue;
      }
      const res = d * FRACTION;
      const floor = Math.floor(res);
      const diff = (res - floor) / d;
      if (diff < smallestDiff) {
        smallestDiff = diff;
        answer.numerator = floor;
        answer.denominator = d;
      }
    }
    return answer.numerator;
  },

  /**
   * Problem 72 Counting fractions
   *
   * Consider the fraction, n/d, where n and d are positive integers.
   *
   * If n<d and HCF(n,d)=1, it is called a reduced proper fraction.
   *
   * If we list the set of reduced proper fractions for d ≤ 8 in ascending order of size, we get:
   *
   * 1/8, 1/7, 1/6, 1/5, 1/4, 2/7, 1/3, 3/8, 2/5, 3/7, 1/2, 4/7, 3/5, 5/8, 2/3, 5/7, 3/4, 4/5, 5/6, 6/7, 7/8
   *
   * It can be seen that there are 21 elements in this set.
   *
   * @question How many elements would be contained in the set of reduced proper fractions for d ≤ 1,000,000?
   */
  e72() {
    // we are basically calculating phi(2) + ... + phi(1,000,000)
    // note that phi(n) = (f1 - 1) / f1 * (f2 - 1) / f2 + ... + (fm - 1) / fm
    // where f1, f2, ..., fm are the prime factors of n

    // we start by generating all prime numbers below 1000000
    // for each generated prime p, we sieve all multiples of that prime p * 2, p * 3, etc.
    // by multiplying each number by (p - 1) / p
    // eventually each integer below 1000000 will be sieved once by each of its prime factors
    const target = 1000000;
    const PRIME_TABLE = utils.generatePrimesTable(target);
    const INTEGER_TABLE = { ...PRIME_TABLE };
    let answer = 0;
    for (let i = 2; i <= target; i++) {
      if (PRIME_TABLE[i]) {
        answer += i - 1;
        for (let j = i; i * j <= target; j++) {
          if (INTEGER_TABLE[i * j]) {
            INTEGER_TABLE[i * j] = INTEGER_TABLE[i * j] * (i - 1) / i;
          } else {
            INTEGER_TABLE[i * j] = j * (i - 1);
          }
        }
      } else {
        answer += INTEGER_TABLE[i];
      }
    }

    return answer;
  },

  /**
   * Problem 73 Counting fractions in a range
   *
   * Consider the fraction, n/d, where n and d are positive integers.
   *
   * If n<d and HCF(n,d)=1, it is called a reduced proper fraction.
   *
   * If we list the set of reduced proper fractions for d ≤ 8 in ascending order of size, we get:
   *
   * 1/8, 1/7, 1/6, 1/5, 1/4, 2/7, 1/3, 3/8, 2/5, 3/7, 1/2, 4/7, 3/5, 5/8, 2/3, 5/7, 3/4, 4/5, 5/6, 6/7, 7/8
   *
   * It can be seen that there are 3 fractions between 1/3 and 1/2.
   *
   * @question How many fractions lie between 1/3 and 1/2 in the sorted set of reduced proper fractions for d ≤ 12,000?
   */
  e73() {
    let answer = 0;
    for (let d = 4; d <= 12000; d++) {
      const lower = d / 3;
      const upper = d / 2;
      const lbNumerator = Number.isInteger(lower) ? lower + 1 : Math.ceil(lower); // proper lower bound
      const ubNumerator = Number.isInteger(upper) ? upper - 1 : Math.floor(upper); // proper upper bound
      if (lbNumerator > ubNumerator) {
        continue;
      }
      for (let n = lbNumerator; n <= ubNumerator; n++) {
        if (utils.gcd(n, d) === 1) {
          answer++;
        }
      }
    }
    return answer;
  },

  /**
   * Problem 74 Digit factorial chains
   *
   * The number 145 is well known for the property that the sum of the factorial of its digits is equal to 145:
   *
   * 1! + 4! + 5! = 1 + 24 + 120 = 145
   *
   * Perhaps less well known is 169, in that it produces the longest chain of numbers that link back to 169; it turns out that there are only three such loops that exist:
   *
   * 169 → 363601 → 1454 → 169
   *
   * 871 → 45361 → 871
   *
   * 872 → 45362 → 872
   *
   * It is not difficult to prove that EVERY starting number will eventually get stuck in a loop. For example,
   *
   * 69 → 363600 → 1454 → 169 → 363601 (→ 1454)
   *
   * 78 → 45360 → 871 → 45361 (→ 871)
   *
   * 540 → 145 (→ 145)
   *
   * Starting with 69 produces a chain of five non-repeating terms, but the longest non-repeating chain with a starting number below one million is sixty terms.
   *
   * @question How many chains, with a starting number below one million, contain exactly sixty non-repeating terms?
   */
  e74() {
    const FACTS = {
      0: 1,
      1: 1,
      2: 2,
      3: 6,
      4: 24,
      5: 120,
      6: 720,
      7: 5040,
      8: 40320,
      9: 362880,
    };

    // giant memoized table of all the numbers and their chain length
    const MEM = {};
    // NOTE: it is true that different numbers with the same digits will have the same chain length.
    // However, it will not reduce the running time by much, as all the numbers with the same digit
    // will find their memoized entry within one depth of the recurrence.
    // Furthermore, the time saved will be recompensed by the sorting of the digits
    // (tested: on average, the sorting method is slightly slower)

    // However, this is a good method if we want to save space

    const sumFactDigits = n => n.toString().split('').reduce((a, c) => a + FACTS[c], 0);

    function computePathLength(n, accMem = {}, chainLength = 0) {
      if (MEM[n]) {
        Object.keys(accMem).forEach((chainElem) => {
          MEM[chainElem] = MEM[n] + chainLength - accMem[chainElem];
        });
        return chainLength + MEM[n];
      }

      if (accMem[n]) {
        const recurrencePeriod = chainLength - accMem[n];
        Object.keys(accMem).forEach((chainElem) => {
          if (accMem[chainElem] < accMem[n]) {
            MEM[chainElem] = chainLength - accMem[chainElem];
          } else {
            MEM[chainElem] = recurrencePeriod;
          }
        });
        return chainLength;
      }

      const next = sumFactDigits(n);
      if (next === n) {
        return 1;
      }
      return computePathLength(next, { ...accMem, [n]: chainLength }, chainLength + 1);
    }

    let res = 0;
    for (let n = 1; n < 1000000; n++) {
      const chainLength = computePathLength(n);
      if (chainLength === 60) {
        res++;
      }
    }
    return res;
  },

  /**
   * Problem 75 Singular integer right triangles
   *
   * It turns out that 12 cm is the smallest length of wire that can be bent to form an integer sided right angle triangle in exactly one way, but there are many more examples.
   *
   * 12 cm: (3,4,5)
   *
   * 24 cm: (6,8,10)
   *
   * 30 cm: (5,12,13)
   *
   * 36 cm: (9,12,15)
   *
   * 40 cm: (8,15,17)
   *
   * 48 cm: (12,16,20)
   *
   * In contrast, some lengths of wire, like 20 cm, cannot be bent to form an integer sided right angle triangle, and other lengths allow more than one solution to be found; for example, using 120 cm it is possible to form exactly three different integer sided right angle triangles.
   *
   * 120 cm: (30,40,50), (20,48,52), (24,45,51)
   *
   * @question Given that L is the length of the wire, for how many values of L ≤ 1,500,000 can exactly one integer sided right angle triangle be formed?
   */
  e75() {
    // keys are the length, value are how many time it has been sieved
    const TRIANGLE_LENGTH_TABLE = {};
    const target = 1500000;
    // we first generate the table of primitive pythagorean triplets
    for (let n = 1; n < 612; n++) {
      for (let m = n + 1; m <= target; m++) {
        const perimeter = 2 * m * (n + m);
        if (perimeter > target) {
          break;
        }
        const isCoprime = utils.gcd(m, n) === 1;
        const isPrimitive = isCoprime && (utils.isEven(m) || utils.isEven(n));
        if (isPrimitive) {
          TRIANGLE_LENGTH_TABLE[perimeter] = 1;
        }
      }
    }

    // for each generated triplet, we sieve all the multiples of that perimeter
    const primitivePerimeters = Object.keys(TRIANGLE_LENGTH_TABLE).map(Number);
    for (let i = 0; i < primitivePerimeters.length; i++) {
      const primitive = primitivePerimeters[i];
      for (let k = 2; primitive * k <= target; k++) {
        TRIANGLE_LENGTH_TABLE[primitive * k] = TRIANGLE_LENGTH_TABLE[primitive * k]
          ? TRIANGLE_LENGTH_TABLE[primitive * k] + 1
          : 1;
      }
    }

    // at the end, for each perimeter, if it has value 1 (ie. it has been sieved exactly once), then it fits the condition
    return Object.keys(TRIANGLE_LENGTH_TABLE).filter(p => TRIANGLE_LENGTH_TABLE[p] === 1).length;
  },

  /**
   * Problem 76 Counting summations
   *
   * It is possible to write five as a sum in exactly six different ways:
   *
   * 4 + 1
   *
   * 3 + 2
   *
   * 3 + 1 + 1
   *
   * 2 + 2 + 1
   *
   * 2 + 1 + 1 + 1
   *
   * 1 + 1 + 1 + 1 + 1
   *
   * @question How many different ways can one hundred be written as a sum of at least two positive integers?
   */
  e76() {
    // this is similar to the change making problem
    // we have 100 coins of value 1, 2 ... 100
    // the question is how to make 100 with those coins
    const MEM = {};
    for (let i = 1; i <= 100; i++) {
      // we do not have to consider j < i as there would be no way of making j with a coin i
      // from this point, MEM[n] denotes the number of ways of making n using coins up to i
      for (let j = i; j <= 100; j++) {
        // the number of ways to make amount j is equal to the sum of
        // 1. the number of ways of making j without using i,
        // which is the number of ways of making change j using coins 1, ..., i - 1
        // which is equal to MEM[j] of the previous iteration
        // 2. the number of ways of making j using i,
        // which is the number of ways of making j - i using 1, 2, ..., i
        // if MEM[j - i] is undefined, it means  j = i, and the answer is 1
        MEM[j] = (MEM[j] || 0) + (MEM[j - i] || 1);
      }
    }
    return MEM[100] - 1;
  },

  /**
   * Problem 77 Prime summations
   * It is possible to write ten as the sum of primes in exactly five different ways:
   *
   * 7 + 3
   *
   * 5 + 5
   *
   * 5 + 3 + 2
   *
   * 3 + 3 + 2 + 2
   *
   * 2 + 2 + 2 + 2 + 2
   *
   * @question What is the first value which can be written as the sum of primes in over five thousand different ways?
   */
  e77() {
    // from problem above, i = 30 was sufficient to generate > 5000 partitions
    // in order to minimize space and time, we will use 46 primes as an upper bound, and increase if necessary
    const PRIMES = Object.keys(utils.generatePrimesTable(200)).map(Number);
    let answer = 0;
    let I = 2;

    // each key is of the form a|b, and the value is the number of partitions of a using primes smaller or equal to b
    const MEM = { };
    while (!answer) {
      for (let i = 2; i <= I; i++) {
        for (let j = 0; j < PRIMES.length; j++) {
          const prime = PRIMES[j];
          if (prime > i) {
            MEM[`${i}|${prime}`] = MEM[`${i}|${PRIMES[j - 1]}`];
            continue;
          }
          if (j === 0) {
            MEM[`${i}|${prime}`] = utils.isEven(i) ? 1 : 0;
            continue;
          }
          const usingPrime = MEM[`${i - prime}|${prime}`] || (i === prime ? 1 : 0);
          const notUsing = MEM[`${i}|${PRIMES[j - 1]}`] || 0;
          if (notUsing + usingPrime > 5000) {
            MEM[`${i}|${prime}`] = notUsing + usingPrime;
            answer = i;
            break;
          }
          MEM[`${i}|${prime}`] = notUsing + usingPrime;
        }
        if (answer) {
          break;
        }
      }
      I++;
    }
    return answer;
  },

  /**
   * Problem 78 Coin Partitions
   *
   * Let p(n) represent the number of different ways in which n coins can be separated into piles.
   *
   * For example, five coins can be separated into piles in exactly seven different ways, so p(5)=7.
   *
   * @question Find the least value of n for which p(n) is divisible by one million.
   */
  e78() {
    // using the pentagonal number theorem, we can use the following recurrence relationship
    // let p(n) denote the number of partitions of n
    // p(n) = p(n - 1) + p(n - 2) - p(n - 5) - p(n - 7) + p(n - 12) + p(n - 17) - ...
    // the subtracted indices are defined as the generalized pentagonal numbers starting at index 1
    let answer = 0;
    let n = 3;
    // memoized partition list MEM[i] = p(i)
    const MEM = [1, 1, 2];
    while (!answer) {
      let i = 1;
      let term = penta(i);
      let currentPartition = 0;
      // sum all terms p(n-1), p(n-2), p(n-5), etc.
      while (term <= n) {
        const sign = (i - 1) % 4 > 1 ? -1 : 1;
        currentPartition += sign * MEM[n - term];
        i++;
        term = penta(i);
      }
      currentPartition %= 1000000;
      if (currentPartition === 0) {
        answer = n;
        break;
      }
      MEM[n] = currentPartition;
      n++;
    }

    return answer;

    // generalized pentagonal number generator
    function penta(k) {
      if (k & 1) {
        const m = (k + 1) / 2;
        return m * (3 * m - 1) / 2;
      }
      const m = k / 2;
      return m * (3 * m + 1) / 2;
    }
  },

  /**
   * Problem 79 Passcode derivation
   *
   * A common security method used for online banking is to ask the user for three random characters from a passcode. For example, if the passcode was 531278, they may ask for the 2nd, 3rd, and 5th characters; the expected reply would be: 317.
   *
   * The text file, [keylog.txt @asset p079_keylog.txt], contains fifty successful login attempts.
   *
   * @question Given that the three characters are always asked for in order, analyse the file so as to determine the shortest possible secret passcode of unknown length.
   */
  e79() {
    const passcodes = fs.readFileSync(path.join(__dirname, './p079_keylog.txt'))
      .toString()
      .split('\n')
      .filter(Boolean);
    // we can remove repeated passcodes
    const uniqAttempts = Array.from(new Set(passcodes));

    // if we spend a minute to look at the attempts, we can see that the passcode contains no repeating digits
    // therefore the solution becomes very straightforward
    // we find the first digit of the passcode by finding the digit that is not preceded by any other digits
    // that digit can always be found, because if not, it means that there must be repeating digits
    // repeat for second, third, etc.

    // since there are no repeats, and our login attempts do not contain a 4 or 5
    // our passcode must have length 8
    const target = 8;
    let digitsFound = 0;
    let answer = '';
    // the list of attempts is updated every time we find a digit, by removing the found digit from it
    let remainingAttempts = [...uniqAttempts];

    // the list of digits yet to be pushed into our answer is updated every time we find an answer
    let remainingDigits = [0, 1, 2, 3, 6, 7, 8, 9];

    while (digitsFound < target) {
      let foundDigit;
      // the list of remaining possible digits for a given step is updated every time we find, in each attempt,
      // a digit which is not in the first position
      let currentPossibilities = [...remainingDigits];

      for (let i = 0; i < remainingAttempts.length; i++) {
        // split each attempt into first and non-first digits (rem array)
        const [first, ...nonFirst] = remainingAttempts[i].split('');
        // for the possible digits remaining, keep the ones that are not included in the list of non-first digits
        currentPossibilities = currentPossibilities.filter(x => !nonFirst.includes(`${x}`));
        // if there is only one possible digit left, then it is the answer
        if (currentPossibilities.length === 1) {
          foundDigit = currentPossibilities[0];
          // push digit into answer string
          answer += foundDigit;
          break;
        }
      }

      // remove the found digit from the list of remaining digits
      remainingDigits = remainingDigits.filter(x => x !== foundDigit);
      // reset the list of remaining possible digits used for traversal through attempts
      currentPossibilities = [...remainingDigits];
      // remove every occurrence of the found digit from the list of attempts
      remainingAttempts = remainingAttempts.map(
        attempt => attempt.split('').filter(
          digit => +digit !== foundDigit,
        ).join(''),
      ).filter(x => x !== '');
      digitsFound++;
    }
    return answer;
  },

  /**
   * Problem 80 Square root digital expansion
   *
   * It is well known that if the square root of a natural number is not an integer, then it is irrational.
   *
   * The decimal expansion of such square roots is infinite without any repeating pattern at all.
   *
   * The square root of two is 1.41421356237309504880..., and the digital sum of the first one hundred decimal digits is 475.
   *
   * @question For the first one hundred natural numbers, find the total of the digital sums of the first one hundred decimal digits for all the irrational square roots.
   */
  e80() {
    let ANSWER = 0;
    // this is very similar to problem 66
    // instead of iterating until we find a solution to an equation
    // we keep iterating until we find a number for which the 100 first decimal is 'stable'
    for (let D = 2; D <= 100; D++) {
      // find leading digits
      const sqrt = Math.sqrt(D);
      const floor = Math.floor(sqrt);
      if (sqrt === floor) {
        continue;
      }
      let repetitionFound = false; // if a repetition has been found, we can exit the loop (explained below)

      // Step 1: Sequence of leading digits
      const leadingDigits = [];

      let isolatedInteger = floor; // leading digit of our current iteration
      let normalizedDenominator; // the denominator as a result of normalization
      // the normalized and reduced denominator (by the initial numerator) of the previous iteration
      let initialNumerator = 1;
      // the offset found in the denominator as a result of isolating the leading integer from the previous iteration
      let denominatorOffset = floor;

      while (!repetitionFound) {
        // normalize
        normalizedDenominator = D - (denominatorOffset ** 2);

        // isolate
        isolatedInteger = Math.floor(initialNumerator * (floor + denominatorOffset) / normalizedDenominator);
        leadingDigits.push(isolatedInteger);
        if (normalizedDenominator === initialNumerator) {
          // the initialNumerator always starts with 1
          // if the above two variables are equal, then the next initialNumerator will be 1,
          // which will cause the cycle to repeat
          repetitionFound = true;
          break;
        }

        // update for next iteration
        initialNumerator = normalizedDenominator / initialNumerator;
        denominatorOffset = Math.abs(denominatorOffset - initialNumerator * isolatedInteger);
      }

      // Step 2: search for solution

      // solution verifier
      // verify if there is a variation in the 101st decimal between the 2 fractions
      // (ie. if the first 101 decimals are equal)
      // we accomplish this by multiplying each numerator by 10^101 before dividing by the denominator
      // this will truncate the 102nd digit (and everything after)
      // if the 101th digit is the same for both fractions,
      // we then just need to round the 100th digit to get our answer
      const getSum100Digits = (num1, denom1, num2, denom2) => {
        const shift = BigInt(10) ** BigInt(101);
        const prevDigits = num1 * shift / denom1;
        const currDigits = num2 * shift / denom2;
        if (prevDigits === currDigits) { // stabilized, return the sum of the 100 digits
          const digits = String(currDigits).slice(0, 100).split('');
          return digits.map(Number).reduce((a, c) => a + c, 0);
        }
        return false;
      };

      // returns nth leading integer in the continued fraction expansion of sqrt(D)
      const getNthLeadingInteger = n => leadingDigits[(n - 1) % leadingDigits.length];

      // initial values
      let target = 1;
      let numerator = BigInt(1);
      let denominator = BigInt(getNthLeadingInteger(target));

      let previousNumerator;
      let previousDenominator;

      let stabilized = false;
      // loop while a solution is not found
      while (!stabilized) {
        numerator = BigInt(1);
        denominator = BigInt(getNthLeadingInteger(target));
        // find the convergent at the `target` index by using backtracking
        for (let i = target - 1; i >= 1; i--) {
          const nextLeadingInteger = BigInt(getNthLeadingInteger(i));
          [numerator, denominator] = [denominator, nextLeadingInteger * denominator + numerator]
        }
        numerator += (denominator * BigInt(floor));
        if (target > 1) {
          const solution = getSum100Digits(previousNumerator, previousDenominator, numerator, denominator);
          if (solution) {
            ANSWER += solution;
            stabilized = true;
            break;
          }
        }
        previousNumerator = numerator;
        previousDenominator = denominator;
        target++;
      }
    }
    return ANSWER;
  },
};
