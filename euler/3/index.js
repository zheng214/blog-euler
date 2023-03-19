
const fs = require('fs');
const path = require('path');
const utils = require('../utils');

module.exports = {
  /**
   * Problem 21: Amicable numbers
   *
   * Let d(n) be defined as the sum of proper divisors of n (numbers less than n which divide evenly into n).
   *
   * If d(a) = b and d(b) = a, where a ≠ b, then a and b are an amicable pair and each of a and b are called amicable numbers.
   *
   * The proper divisors of 220 are 1, 2, 4, 5, 10, 11, 20, 22, 44, 55 and 110; therefore d(220) = 284
   *
   * The proper divisors of 284 are 1, 2, 4, 71 and 142; so d(284) = 220.
   *
   * @question Evaluate the sum of all the amicable numbers under 10000.
   * @guide
   * We observe that, by definition, a number n has an amicable pair if and only if d(d(n)) = n.
   *
   * A number cannot be an amicable pair to itself, so for each number i under 10000, we check that is not perfect, ie. d(i) = i.
   * 
   * Then if it satisfies d(d(i)) = i, we add it to the list, and sum the list at the end.
   */
  e21() {
    const primesUnder10000 = utils.generatePrimesTable(10000);
    const amicableNumbers = [];
    for (let i = 0; i < 10000; i++) {
      if (!primesUnder10000[i] && !amicableNumbers.includes(i)) {
        // d(i)
        const sumOfDivisors = utils.computeSumOfDivisors(i);
        // ensure i is not a perfect number (d(i) = i)
        // which does not qualify as an amicable number by definition
        if (sumOfDivisors !== i) {
          // now check if d(d(i)) === i
          if (utils.computeSumOfDivisors(sumOfDivisors) === i) {
            amicableNumbers.push(i);
            amicableNumbers.push(sumOfDivisors);
          }
        }
      }
    }

    return utils.sumArray(amicableNumbers);
  },

  /**
   * Problem 22: Names scores
   *
   * Using [p22_names.txt @asset p22_names.txt], a 46K text file containing over five-thousand first names. Begin by sorting it into alphabetical order. Then working out the alphabetical value for each name, multiply this value by its alphabetical position in the list to obtain a name score.
   *
   * When the list is sorted into alphabetical order, COLIN, which is worth 3 + 15 + 12 + 9 + 14 = 53, is the 938th name in the list. So, COLIN would obtain a score of 938 × 53 = 49714.
   *
   * @question What is the total of all the name scores in the file?
   * @guide
   * Very straightforward, just go down the list and add the name scores one by one.
   */
  e22() {
    const stringNames = fs.readFileSync(path.join(__dirname, 'p22_names.txt')).toString();
    const arrayNames = stringNames.split(',');
    const sortedNames = arrayNames.sort();
    return sortedNames.reduce(
      (totalScore, name, index) => {
        const i = index + 1;
        const scoreOfName = i * utils.sumArray(
          name.split(''), // 'AARON' => ['A', 'A', 'R', 'O', 'N']
          n => n.charCodeAt() - 64, // a -> 1, r -> 18, etc.
        );
        return totalScore + scoreOfName;
      },
      0,
    );
  },

  /**
   * Problem 23: Non-abundant sums
   *
   * A number n is called deficient if the sum of its proper divisors is less than n and it is called abundant if this sum exceeds n.
   *
   * By mathematical analysis, it can be shown that all integers greater than 28123 can be written as the sum of two abundant numbers.
   *
   * However, this upper limit cannot be reduced any further by analysis even though it is known that the greatest number that cannot be expressed as the sum of two abundant numbers is less than this limit.
   *
   * As 12 is the smallest abundant number, 1 + 2 + 3 + 4 + 6 = 16, the smallest number that can be written as the sum of two abundant numbers is 24.
   *
   * @question Find the sum of all the positive integers which cannot be written as the sum of two abundant numbers.
   * @guide
   * Since all numbers above 28123 can be written as the sum of two abundant numbers, we only need to check numbers from 1 to 28123 inclusively.
   * 
   * To do so, for each number i in 1 to 28123, we:
   * 1. Check if it's abundant, if so, we insert it in the <code>abundantNumbers</code> table.
   * 2. We substract i by every abundant number encountered so far, if the result of that substraction is another abundant number, then it does not satisfy our condition. And vice-versa.
   */
  e23() {
    const abundantNumbers = {};
    let result = 0;
    for (let i = 1; i <= 28123; i++) {
      if (utils.computeSumOfDivisors(i) > i) {
        abundantNumbers[i] = true;
      }
      // check if number can be written as sum of two abundant numbers
      let canBeSummed = false;
      const abundantNumbersArray = Object.keys(abundantNumbers);
      for (let j = 0; j < abundantNumbersArray.length; j++) {
        if (abundantNumbersArray[j] > i / 2) {
          break; // we don't need to check for numbers above i / 2
        }
        if (abundantNumbers[i - abundantNumbersArray[j]]) {
          canBeSummed = true;
          break;
        }
      }
      if (!canBeSummed) {
        result += i;
      }
    }

    return result;
  },

  /**
   * Problem 24: Lexicographic permutations
   *
   * A permutation is an ordered arrangement of objects. For example, 3124 is one possible permutation of the digits 1, 2, 3 and 4.
   *
   * If all of the permutations are listed numerically or alphabetically, we call it lexicographic order.
   *
   * The lexicographic permutations of 0, 1 and 2 are:
   *
   *  012   021   102   120   201   210
   *
   * @question What is the millionth lexicographic permutation of the digits 0, 1, 2, 3, 4, 5, 6, 7, 8 and 9?
   * @guide
   * We achieve the answer to the question in two steps. First we find the factorial number representation of one million. Second we use that representation to 'calculate' our permutation.
   * 
   * 1. Factorial number system representation conversion:
   * 
   * decimal -> factorial
   * 
   * <code>0 -> 00(fact)</code>
   * <code>1 -> 1 * 1! -> 01 (fact)</code>
   * <code>2 -> 1 * 2! + 0 * 1! -> 10(fact)</code>
   * <code>3 -> 1 * 2! + 1 * 1! -> 11(fact)</code>
   * <code>4 -> 2 * 2! -> 20(fact)</code>
   * <code>5 -> 2 * 2! + 1 * 1! -> 21(fact)</code>
   * <code>6 -> 1 * 3! -> 100(fact)</code>
   * 
   * 2. Using a Factorial number representation to 'calculate' a permutation
   * We iteratively write our permutation, with the following rule: Each digit in the factorial representation decides the index from which we grab our next digit from the remaining digits. It sounds confusing, so here is an example.
   * 
   * For example, if we want the 5th permutation of 1234
   * We find the factorial representation of 5, which is 021.
   * The first digit is 0, so we pick the 1st digit from 1234, we get 1, this is our first digit of the result.
   * The second digit is 2, so we pick the 3rd digit from the <i>remaining</i> digits, ie 234, we get 4, this is the second digit of the result.
   * The third digit is 1, so we pick the 2nd digit from the <i>remaining</i> digits, ie 23, we get 3, this is the third digit of the result.
   * The only digit left is 2, so our final result is 1432.
   */
  e24() {
    const ONE_MILLION = 1000000;
    const factorialRepr = utils.convertToFactorialBase(ONE_MILLION - 1);
    let remainingDigits = '0123456789';
    let result = '';

    for (let k = 0; k < factorialRepr.length; k++) {
      const indexToGrab = factorialRepr.charAt(k);
      result += remainingDigits[indexToGrab];
      remainingDigits = remainingDigits.replace(`${remainingDigits[indexToGrab]}`, '');
    }

    // add last digit remaining
    return +(result + remainingDigits);
  },

  /**
   * Problem 25: 1000-digit Fibonacci number
   * @question What is the index of the first term in the Fibonacci sequence to contain 1000 digits?
   * @guide
   * Since javascript numbers only handles up to ~ 1.7976931348623157e+308, we have to add each digit manually and store them inside an array.
   * e.g. [2, 4] + [3, 8] => [6, 2]
   * e.g. [1, 4, 5] + [8, 5, 5] => [1, 0, 0, 0]
   */
  e25() {
    let [a, b] = [[1], [1]];
    let index = 2;
    while (b.length < 1000) {
      index++;
      [a, b] = [b, manualSum(a, b)];
    }

    return index;

    function manualSum(arr1, arr2) {
      const a1 = arr1.length >= arr2.length ? [...arr1].reverse() : [...arr2].reverse(); // longer array
      const a2 = arr1.length >= arr2.length ? [...arr2].reverse() : [...arr1].reverse(); // shorter array
      const result = [];
      let carry = 0;
      for (let i = 0; i < a1.length; i++) {
        const partialResult = a1[i] + (a2[i] || 0) + carry;
        if (partialResult >= 10) {
          carry = 1;
          result[i] = partialResult - 10;
        } else {
          carry = 0;
          result[i] = partialResult;
        }
      }
      if (carry) {
        result.push(1);
      }
      return result.reverse();
    }
  },

  /**
   * Problem 26: Reciprocal cycles
   * The decimal representation of the unit fractions with denominators 2 to 10 are given:
   *
   *  1/2 = 0.5
   *
   *  1/3 = 0.(3)
   *
   *  1/4 = 0.25
   *
   *  1/5 = 0.2
   *
   *  1/6 = 0.1(6)
   *
   *  1/7 = 0.(142857)
   *
   *  1/8 = 0.125
   *
   *  1/9 = 0.(1)
   *
   *  1/10 = 0.1
   *
   * Where 0.1(6) means 0.166666..., and has a 1-digit recurring cycle. It can be seen that 1/7 has a 6-digit recurring cycle.
   *
   * @question Find the value of d < 1000 for which 1/d contains the longest recurring cycle in its decimal fraction part.
   * @guide
   * First, we can skip numbers that are divisible by 2, 3 or 5, as they are either terminating (2, 5) or have only 1 repeating digit (3).
   * For each number i in 1 to 1000, we do a manual long division on it, the way we learned in primary school.
   * At each step in the division, we will obtain a remainder, that remainder will be stored in <code>remainders</code>.
   * We repeat until we find a remainder that we have already seen in the array <code>remainders</code>.
   * At this point, the length of <code>remainders</code> will be the recurring cycle length.
   */
  e26() {
    let longestRecurringCycle = 0;
    let longestRecurringCycleValue = 0;
    for (let i = 1; i < 1000; i++) {
      // we can skip numbers that are divisible by 2, 3 or 5, as they are either terminating (2, 5) or have only 1 repeating digit (3)
      if (i % 2 && i % 3 && i % 5) {
        // we manually divide 1/i, and keep track of the remainders,
        // if a remainder is in the list of seen remainders,
        // then the length of the seen remainders is the length recurrent cycle
        // the length of the recurrent cycle cannot be greater or equal than i,
        // as the number of unique remainders obtained by dividing by i are between (0 and i - 1)
        const remainders = [];
        let remainder = 1;
        for (let j = 1; j <= i; j++) {
          remainder = (remainder * 10) % i;
          if (remainders.includes(remainder)) {
            if (remainders.length > longestRecurringCycle) {
              longestRecurringCycle = remainders.length;
              longestRecurringCycleValue = i;
            }
            break;
          }
          remainders.push(remainder);
        }
      }
    }
    return longestRecurringCycleValue;
  },


  /**
   * Problem 27: Quadratic primes
   * Euler discovered the remarkable quadratic formula: n²+n+41.
   *
   * It turns out that the formula will produce 40 primes for the consecutive integer values 0≤n≤39.
   *
   * However, when n=40,40²+40+41=40(40+1)+41 is divisible by 41, and certainly when n=41,41²+41+41 is clearly divisible by 41.
   *
   * The incredible formula n²−79n+1601 was discovered, which produces 80 primes for the consecutive values 0≤n≤79.
   *
   * The product of the coefficients, −79 and 1601, is −126479.
   *
   * Considering quadratics of the form:
   *
   * n²+an+b, where |a|<1000 and |b|≤1000
   *
   * @question Find the product of the coefficients, a and b, for the quadratic expression that produces the maximum number of primes for consecutive values of n, starting with n=0.
   * @guide
   * Instead of searching for every value of a and b between -999 to 999, we can observe the following:
   * 
   * Let Q = n²+an+b be a prime generating quadratic polynomial, for Q to be valid, b must be a prime number (as Q(0) = b).
   * 
   * Further, we can see that Q(n) > 1, since primes all are bigger than 1.
   * 
   * Therefore Q(1) > 1.
   * => 1 + a + b > 1
   * => a > -b
   * 
   * So, b must be a prime and a > -b, which limits our search space.
   */
  e27() {
    const primesArray = Object.keys(utils.generatePrimesTable(1000)).map(x => +(x));
    let longestConsecutivePrimes = 40;
    let productOfLongest = 0;
    for (let i = 0; i < primesArray.length; i++) {
      const b = primesArray[i];
      for (let a = -b + 1; a < 999; a++) {
        const consecutivePrimesLength = computeConsecutivePrimesLength(a, b);
        if (consecutivePrimesLength > longestConsecutivePrimes) {
          longestConsecutivePrimes = consecutivePrimesLength;
          productOfLongest = a * b;
        }
      }
    }
    return productOfLongest;

    function computeConsecutivePrimesLength(a, b) {
      let n = 1;
      let Q = 1 + a + b;
      while (utils.isPrime(Q)) {
        n++;
        Q = (n ** 2) + a * n + b;
      }
      return n;
    }
  },

  /**
   * Problem 28: Number spiral diagonals
   * Starting with the number 1 and moving to the right in a clockwise direction a 5 by 5 spiral is formed as follows:
   *
   *  [21]  22   23   24  [25]
   *
   *  20  [07]  08  [09]  10
   *
   *  19   06  [01]  02   11
   *
   *  18  [05]  4   [03]  12
   *
   *  [17]  16   15   14  [13]
   *
   * It can be verified that the sum of the numbers on the diagonals (enclosed by [brackets]) is 101.
   *
   * @question What is the sum of the numbers on the diagonals in a 1001 by 1001 spiral formed in the same way?
   * @guide
   * By convenience we will say that [01] is on the 0th square.
   * We notice that the 4 corner numbers on the nth outer square are spaced apart from each other by 2*n.
   * We can also observe that the last encountered diagonal number (top-right corner) is (2n-1)².
   * Then the sum of diagonals of the nth square is
   * (2n-1)² + 2n + (2n-1)² + 4n + (2n-1)² + 6n + (2n-1)² + 8n
   * = 4(2n-1)² + 20n = 16n² + 4n + 4
   * In a 5x5 square, there are 2 layers + [01]
   * If we have a 1001 by 1001 square then we have 500 layers + [01]
   */
  e28() {
    let sum = 0;
    for (let i = 1; i <= 500; i++) {
      sum += (16 * (i ** 2) + (4 * i) + 4);
    }
    return sum + 1;
  },

  /**
   * Problem 29: Distinct powers
   * Consider all integer combinations of a^b for 2 ≤ a ≤ 5 and 2 ≤ b ≤ 5:
   *
   * If they are then placed in numerical order, with any repeats removed, we get the following sequence of 15 distinct terms:
   *
   * 4, 8, 9, 16, 25, 27, 32, 64, 81, 125, 243, 256, 625, 1024, 3125
   *
   * @question How many distinct terms are in the sequence generated by a^b for 2 ≤ a ≤ 100 and 2 ≤ b ≤ 100?
   * @guide 
   * We just need to find the number of collisions (ie. 2⁴ = 4²), and subtract that from 99²
   * Collisions must involve a power of 2, 3, 5, 6, 7, 10
   * 2 will collide with powers of 4, 8, 16, ..., 64
   * 3 will collide with powers of 9, 27, 81
   * 5 will collide with powers of 25, 6 with 36, 7 with 49, and 10 with 100.
   * For 5,6,7, and 10 there are 49 collisions each, ie. even powers
   * For example, (5⁴ collides with 25², 5⁶ collides with 25³, ..., 5¹⁰⁰ collides with 25⁵⁰)
   * We get 196 collisions for those 4 bases.
   * Next we compute the collisions for powers of 2 (ie. 2, 4, 8, 16, 32, 64), and the collisions for powers of 3 (ie. 3, 9, 27, 81)
   *
   * I will explain how to count the collisions for powers of 2, powers of 3 works in the same way.
   * We reduce all numbers that are powers of two to the base of 2.
   * For example, instead of writing 32⁶, we write 2⁵⁽⁶⁾ = 2³⁰.
   * For example, instead of writing 64⁵, we write 2⁶⁽⁵⁾ = 2³⁰.
   * We reduce all powers of 2 into 2^(m * n) where 1 <= m <= 6 and 1 <= n <= 100.
   * We then loop through all 1 <= m <= 6 and 2 <= n <= 100, calculate m * n and see how many unique values we get, that is the number of distinct powers of 2. To get the number of collisions, we substract that from 6 * 99.
   * The same works for powers of 3, except we use 1 <= m <= 4.
   */
  e29() {
    // the power is unique if the exponent part (m * n) is also unique
    const uniquePowersOf2 = new Set();
    const uniquePowersOf3 = new Set();
    for (let i = 2; i <= 100; i++) {
      for (let m = 1; m <= 6; m++) {
        // if i * m is already in the set, ie. we seen that equivalent power before,
        // the following operation will add nothing
        uniquePowersOf2.add(i * m);
        if (m <= 4) {
          uniquePowersOf3.add(i * m);
        }
      }
    }
    const collisionsOf2 = 6 * 99 - uniquePowersOf2.size;
    const collisionsOf3 = 4 * 99 - uniquePowersOf3.size;
    const totalCollisions = collisionsOf2 + collisionsOf3 + 196;
    return 99 * 99 - totalCollisions;
  },

  /**
   * Problem 30: Digit fifth powers
   * Surprisingly there are only three numbers that can be written as the sum of fourth powers of their digits:
   *
   * 1634 = 1⁴ + 6⁴ + 3⁴ + 4⁴
   *
   * 8208 = 8⁴ + 2⁴ + 0⁴ + 8⁴
   *
   * 9474 = 9⁴ + 4⁴ + 7⁴ + 4⁴
   *
   * As 1 = 1⁴ is not a sum it is not included.
   *
   * The sum of these numbers is 1634 + 8208 + 9474 = 19316.
   *
   * @question Find the sum of all the numbers that can be written as the sum of fifth powers of their digits.
   * @guide
   * Let N be a number that can be written as the sum of fifth powers of their digits.
   * We first observe N cannot have more than 6 digits, as it will be too large for the sum to add up to (9⁵ = 59049).
   * N also obviously cannot have 1 digit, by quickly checking we can also see that N cannot have 2 digits, so we need to verify numbers between 3 and 6 digits.
   * We use a few heuristics to limit our search space. For example, for numbers with 3 digits, the valid numbers that form N are 0 to 3, as 4⁵ > 999
   */
  e30() {
    const fifthPowerDigits = []; // list of N's defined above

    // table that stores the max allowed digit for a given number length
    // e.g for numbers with 3 digits, the valid numbers that form N are 0 to 3, as 4^5 > 999
    const maxAllowedDigits = {};
    // if max allowed digit is 9, we don't need to go through the trouble of skipping/pruning
    let needPruning = true;

    for (let i = 100; i < 999999; i++) {
      const digits = i.toString().split('');
      let maxExceeded = false;
      if (needPruning) {
        const numberOfDigits = digits.length;
        let maxAllowedDigit;
        if (maxAllowedDigits[numberOfDigits]) {
          // if max allowed digit is already in table, we grab it
          maxAllowedDigit = maxAllowedDigits[numberOfDigits];
        } else {
          // otherwise, we compute the max allowed digits for a given digits length
          maxAllowedDigit = 0;
          while ((maxAllowedDigit + 1) ** 5 < 10 ** numberOfDigits) {
            maxAllowedDigit++;
          }
          maxAllowedDigits[numberOfDigits] = maxAllowedDigit;
        }
        if (maxAllowedDigit === 9) {
          needPruning = false;
        }
        // we check if a digit exceed the max, if so we check the next number
        // e.g. 240 is not a valid number as 4 > 3, so we add 60 (ie. 6 * 10^1, or (10 - 4) * 10 ^ (3 - 2))
        digits.forEach((digit, position) => {
          if (+(digit) > maxAllowedDigit) {
            i += (10 - maxAllowedDigit) * (10 ** (numberOfDigits - position - 1)) - 2;
            maxExceeded = true;
          }
        });
      }
      if (!maxExceeded) {
        const sumOfFifthPowers = utils.sumArray(digits, x => (+(x)) ** 5);
        if (sumOfFifthPowers === i) {
          fifthPowerDigits.push(i);
        }
      }
    }

    return utils.sumArray(fifthPowerDigits);
  },
};
