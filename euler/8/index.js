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

  /**
   * Problem 75 Singular integer right triangles
   *
   * It turns out that 12 cm is the smallest length of wire that can be bent to form an integer sided right angle
   * triangle in exactly one way, but there are many more examples.
   *
   * 12 cm: (3,4,5)
   * 24 cm: (6,8,10)
   * 30 cm: (5,12,13)
   * 36 cm: (9,12,15)
   * 40 cm: (8,15,17)
   * 48 cm: (12,16,20)
   *
   * In contrast, some lengths of wire, like 20 cm, cannot be bent to form an integer sided right angle triangle,
   * and other lengths allow more than one solution to be found; for example, using 120 cm it is possible to form
   * exactly three different integer sided right angle triangles.
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
   * 3 + 2
   * 3 + 1 + 1
   * 2 + 2 + 1
   * 2 + 1 + 1 + 1
   * 1 + 1 + 1 + 1 + 1
   *
   * @question How many different ways can one hundred be written as a sum of at least two positive integers?
   */
  e76() {
    // we use the same algorithm as problem 31, replacing the coins by the digits 1 through 100
    const NUMBERS = [...Array(100)].map((_, i) => i + 1); // 1 to 100
    // our final result
    let ways = 0;

    function count(amountLeft, levelIndex = 99) {
      if (amountLeft < 0) {
        // dead branch
        return 0;
      }
      if (levelIndex === 1) {
        // reached leaf
        return Math.floor(amountLeft / 2) + 1;
      }
      if (amountLeft === 0) {
        // if amountLeft is 0, it means we called count on amountLeft with a number equal to it
        // eg. count(74 - 2 * 37): how many ways are there to add to 74 using two 39's
        return 1;
      }

      // for a given amountLeft, calculate all the ways to make that amount using the number at the next level
      for (let i = 0; i <= Math.floor(amountLeft / NUMBERS[levelIndex]); i++) {
        // 'generate' branches according to amountLeft/level
        const changesAtLevel = count(amountLeft - i * NUMBERS[levelIndex], levelIndex - 1);
        ways += changesAtLevel;
      }
      return 0;
    }

    count(100);
    return ways - 1; // exclude { 100 }
  },
};
