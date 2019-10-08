module.exports = {
  /**
   * Problem 71 Ordered fractions
   *
   * Consider the fraction, n/d, where n and d are positive integers.
   * If n<d and HCF(n,d)=1, it is called a reduced proper fraction.
   *
   * If we list the set of reduced proper fractions for d ≤ 8 in ascending order of size, we get:
   * 1/8, 1/7, 1/6, 1/5, 1/4, 2/7, 1/3, 3/8, 2/5, 3/7, 1/2, 4/7, 3/5, 5/8, 2/3, 5/7, 3/4, 4/5, 5/6, 6/7, 7/8
   *
   * It can be seen that 2/5 is the fraction immediately to the left of 3/7.
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
   * If n<d and HCF(n,d)=1, it is called a reduced proper fraction.
   *
   * If we list the set of reduced proper fractions for d ≤ 8 in ascending order of size, we get:
   * 1/8, 1/7, 1/6, 1/5, 1/4, 2/7, 1/3, 3/8, 2/5, 3/7, 1/2, 4/7, 3/5, 5/8, 2/3, 5/7, 3/4, 4/5, 5/6, 6/7, 7/8
   *
   * It can be seen that there are 21 elements in this set.
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
    const PRIME_TABLE = utils.generatePrimeTable(target);
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
   * If n<d and HCF(n,d)=1, it is called a reduced proper fraction.
   *
   * If we list the set of reduced proper fractions for d ≤ 8 in ascending order of size, we get:
   * 1/8, 1/7, 1/6, 1/5, 1/4, 2/7, 1/3, 3/8, 2/5, 3/7, 1/2, 4/7, 3/5, 5/8, 2/3, 5/7, 3/4, 4/5, 5/6, 6/7, 7/8
   *
   * It can be seen that there are 3 fractions between 1/3 and 1/2.
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
   * 1! + 4! + 5! = 1 + 24 + 120 = 145
   *
   * Perhaps less well known is 169, in that it produces the longest chain of numbers that link back to 169;
   * it turns out that there are only three such loops that exist:
   * 169 → 363601 → 1454 → 169
   * 871 → 45361 → 871
   * 872 → 45362 → 872
   *
   * It is not difficult to prove that EVERY starting number will eventually get stuck in a loop. For example,
   * 69 → 363600 → 1454 → 169 → 363601 (→ 1454)
   * 78 → 45360 → 871 → 45361 (→ 871)
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

};
