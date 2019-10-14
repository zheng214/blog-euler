module.exports = {
  /**
   * Problem 61 Cyclical figurate numbers
   *
   * Triangle, square, pentagonal, hexagonal, heptagonal, and octagonal numbers are all figurate (polygonal) numbers and are generated by the following formulae:
   *
   * Triangle P3,n=n(n+1)/2  1, 3, 6, 10, 15, ...
   * Square P4,n=n^2  1, 4, 9, 16, 25, ...
   * Pentagonal P5,n=n(3n−1)/2   1, 5, 12, 22, 35, ...
   * Hexagonal P6,n=n(2n−1)   1, 6, 15, 28, 45, ...
   * Heptagonal P7,n=n(5n−3)/2   1, 7, 18, 34, 55, ...
   * Octagonal P8,n=n(3n−2)   1, 8, 21, 40, 65, ...
   *
   * The ordered set of three 4-digit numbers: 8128, 2882, 8281, has three interesting properties.
   * 1. The set is cyclic, in that the last two digits of each number is the first two digits of the next number (including the last number with the first).
   * 2. Each polygonal type: triangle (P3,127=8128), square (P4,91=8281), and pentagonal (P5,44=2882), is represented by a different number in the set.
   * 3. This is the only set of 4-digit numbers with this property.
   *
   * @question Find the sum of the only ordered set of six cyclic 4-digit numbers for which each polygonal type: triangle, square, pentagonal, hexagonal,
   * @question heptagonal, and octagonal, is represented by a different number in the set.
   */
  e61() {
    const polygonalTables = [{}, {}, {}, {}, {}, {}];
    const startingIndexes = [45, 32, 26, 23, 21, 19];
    const polygonGenerators = [
      n => n * (n + 1) / 2,
      n => n * n,
      n => n * (3 * n - 1) / 2,
      n => n * (2 * n - 1),
      n => n * (5 * n - 3) / 2,
      n => n * (3 * n - 2),
    ];

    // table indexed by prefixes
    // constructed such that finding all the polygonals starting with any 2 digits can be done with O(1)
    const prefixLookup = {};

    for (let i = 0; i < startingIndexes.length; i++) {
      const side = i + 3;
      const startingIndex = startingIndexes[i];
      let generatedNumber = 0;
      for (let n = startingIndex; generatedNumber < 10000; n++) {
        generatedNumber = polygonGenerators[i](n);
        const [prefix, suffix] = `${generatedNumber}`.match(/\d{1,2}/g);
        if (suffix.charAt(0) === '0' || generatedNumber > 9999) {
          // third digit is 0, cannot be in a cycle
          continue;
        }
        polygonalTables[i][generatedNumber] = true;

        if (!prefixLookup[prefix]) {
          prefixLookup[prefix] = {};
        }

        if (!prefixLookup[prefix][side]) {
          prefixLookup[prefix][side] = [];
        }

        prefixLookup[prefix][side].push(generatedNumber);
      }
    }

    const octagons = polygonalTables[5];

    // simulate a tree, recursively find a path of length 6
    function findPath(path, acc) {
      // cycle complete
      if (path.length === 6) {
        const first = path[0];
        const last = path[5];
        if (Math.floor(first / 100) === last % 100) {
          // FOUND!
          return path;
        }
        return false;
      }
      const last = path[path.length - 1];

      const suffix = last.toString().match(/\d{1,2}/g)[1];

      // all polygonals starting with the current suffix
      const nextPolygons = prefixLookup[suffix];
      if (!nextPolygons) {
        return false;
      }

      // find the next polygon from all sides which are still missing from the cycle
      const missingSides = Object.keys(acc).filter(key => !acc[key]);
      for (let i = 0; i < missingSides.length; i++) {
        const missingSide = missingSides[i];
        const nextMatchingPolygons = nextPolygons[missingSide];
        if (nextMatchingPolygons) {
          for (let j = 0; j < nextMatchingPolygons.length; j++) {
            const nextPolygon = nextMatchingPolygons[j];
            // if a valid path is found, return it, otherwise keep looping
            const findNextPath = findPath([...path, nextPolygon], { ...acc, [missingSide]: nextPolygon });
            if (findNextPath) {
              return findNextPath;
            }
          }
        }
      }

      // if no polygons are found with none of the missing sides, return false
      return false;
    }

    // we start our path from the octagons to minimize loop count
    for (let o = 0; o < Object.keys(octagons).length; o++) {
      const octagon = +Object.keys(octagons)[o];
      const validPath = findPath([octagon], {
        3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: octagon,
      });
      if (validPath) {
        return utils.sumArray(validPath);
      }
    }
  },

  /**
   * Problem 62 Cubic permutations
   *
   * The cube, 41063625 (345^3), can be permuted to produce two other cubes: 56623104 (384^3) and 66430125 (405^3).
   * In fact, 41063625 is the smallest cube which has exactly three permutations of its digits which are also cube.
   *
   * @question Find the smallest cube for which exactly five permutations of its digits are cube.
   */
  e62() {
    // we generate a cube, sort its digits, and index it
    // whenever an index has length 5, return result
    const cubeClasses = {};

    let base = 1;
    let found = false;
    while (!found) {
      const cube = base ** 3;
      const sortedKey = cube.toString().split('').sort().join('');
      if (!cubeClasses[sortedKey]) {
        cubeClasses[sortedKey] = [cube];
      } else {
        cubeClasses[sortedKey].push(cube);
      }

      if (cubeClasses[sortedKey].length > 4) {
        found = true;
        return cubeClasses[sortedKey][0];
      }
      base++;
    }
  },

  /**
   * Problem 63 Powerful digit counts
   *
   * The 5-digit number, 16807=7^5, is also a fifth power. Similarly, the 9-digit number, 134217728=8^9, is a ninth power.
   * @question How many n-digit positive integers exist which are also an nth power?
   */
  e63() {
    let answer = 0;

    // we reach the limit when the number of digits of 9^n is smaller than n
    let limitReached = false;
    let exponent = 1;

    while (!limitReached) {
      for (let digit = 9; digit > 0; digit--) {
        const power = digit ** exponent;
        const digitCount = power.toString().length;
        if (digitCount < exponent) {
          if (digit === 9) {
            limitReached = true;
            return answer;
          }
          break;
        }
        answer++;
      }
      exponent++;
    }
  },

  /**
   * Problem 64 Odd period square roots
   *
   * [tldr; Generate the leading digits of the continued fraction form of the square roots and detect repeating digits](https://projecteuler.net/problem=64)
   * @question How many continued fractions for N≤10000 have an odd period?
   */
  e64() {
    const squares = [...Array(100)].reduce((acc, _, i) => {
      acc[i ** 2] = true;
      return acc;
    }, {});

    let answer = 0;

    for (let N = 2; N < 10000; N++) {
      if (squares[N]) {
        continue;
      }

      // we generate the sequence of isolated integers (ie. leading numbers in the continued fraction sequence) by
      // 1. Normalizing our irrational fraction (ie. `numerator / (root - offset)`) by multiplying by `(root + offset)/(root + offset)`
      // 2. Isolating the next leading integer by finding the integral part of our normalized fraction
      // 3. flip the fractional part to use for the next iteration
      const root = Math.sqrt(N);
      const floor = Math.floor(root);

      let repetitionFound = false; // if a repetition has been found, we can exit the loop (explained below)

      // the following variables are updated on every iteration
      let period = 0; // period count

      let isolatedInteger = floor; // leading digit of our current iteration
      let normalizedDenominator; // the denominator as a result of normalization
      let initialNumerator = 1; // the normalized and reduced denominator (by the initial numerator) of the previous iteration
      let denominatorOffset = floor; // the offset found in the denominator as a result of isolating the leading integer from the previous iteration

      while (!repetitionFound) {
        // normalize
        normalizedDenominator = N - (denominatorOffset ** 2);

        // isolate
        isolatedInteger = Math.floor(initialNumerator * (floor + denominatorOffset) / normalizedDenominator);
        period++;
        if (normalizedDenominator === initialNumerator) {
          // the initialNumerator always starts with 1
          // if the above two variables are equal, then the next initialNumerator will be 1, which will cause the cycle to repeat
          repetitionFound = true;
          if (period & 1) {
            answer++;
          }
          break;
        }

        // update for next iteration
        initialNumerator = normalizedDenominator / initialNumerator;
        denominatorOffset = Math.abs(denominatorOffset - initialNumerator * isolatedInteger);
      }
    }
    return answer;
  },

  /**
   * Problem 65 Convergents of e
   * [tldr; Find ith element from a sequence of partial continued fraction](https://projecteuler.net/problem=65)
   *
   * @question Find the sum of digits in the numerator of the 100th convergent of the continued fraction e
   */
  e65() {
    function getNthLeadingInteger(n) {
      if (n < 3) {
        return n;
      }

      if (n % 3 === 2) {
        return 2 * (Math.floor(n / 3) + 1);
      }

      return 1;
    }

    const target = 100;
    let numerator = 1;
    let denominator = getNthLeadingInteger(target - 1);
    for (let i = target - 1; i >= 1; i--) {
      const nextLeadingInteger = getNthLeadingInteger(i - 1);
      [numerator, denominator] = [BigInt(denominator), BigInt(nextLeadingInteger) * BigInt(denominator) + BigInt(numerator)];
    }

    numerator += (denominator * 2n); // add leading constant
    return utils.sumArray(numerator.toString().split(''), n => +n);
  },

  /**
   * Problem 66 Diophantine equation
   *
   * Consider quadratic Diophantine equations of the form: x^2 - D * y^2 = 1
   * For example, when D=13, the minimal solution in x is 649^2 – 13×180^2 = 1.
   * It can be assumed that there are no solutions in positive integers when D is square.
   *
   * By finding minimal solutions in x for D = {2, 3, 5, 6, 7}, we obtain the following:
   *
   * 3^2 – 2×2^2 = 1
   * 2^2 – 3×1^2 = 1
   * 9^2 – 5×4^2 = 1
   * 5^2 – 6×2^2 = 1
   * 8^2 – 7×3^2 = 1
   * Hence, by considering minimal solutions in x for D ≤ 7, the largest x is obtained when D=5.
   *
   * @question Find the value of D ≤ 1000 in minimal solutions of x for which the largest value of x is obtained.
   */
  e66() {
    // to solve for (x,y) for any D, we need to:
    // 1. find the sequence of leading digits for the continued fractions of sqrt(D)
    // 2. from the list above, expand continued fractions until a solution is found

    let largestSolution = 0n;
    let ANSWER = 0;
    // we combine the previous 2 solutions to achieve the steps above
    for (let D = 2; D <= 1000; D++) {
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
      let initialNumerator = 1; // the normalized and reduced denominator (by the initial numerator) of the previous iteration
      let denominatorOffset = floor; // the offset found in the denominator as a result of isolating the leading integer from the previous iteration

      while (!repetitionFound) {
        // normalize
        normalizedDenominator = D - (denominatorOffset ** 2);

        // isolate
        isolatedInteger = Math.floor(initialNumerator * (floor + denominatorOffset) / normalizedDenominator);
        leadingDigits.push(isolatedInteger);
        if (normalizedDenominator === initialNumerator) {
          // the initialNumerator always starts with 1
          // if the above two variables are equal, then the next initialNumerator will be 1, which will cause the cycle to repeat
          repetitionFound = true;
          break;
        }

        // update for next iteration
        initialNumerator = normalizedDenominator / initialNumerator;
        denominatorOffset = Math.abs(denominatorOffset - initialNumerator * isolatedInteger);
      }

      // Step 2: search for solution

      // solution verifier
      const isSolution = (x, y) => (((x ** BigInt(2)) - (BigInt(D) * (y ** BigInt(2)))) === BigInt(1));
      // returns nth leading integer in the continued fraction expansion of sqrt(D)
      const getNthLeadingInteger = n => leadingDigits[(n - 1) % leadingDigits.length];

      // initial values
      let target = 1;
      let numerator = BigInt(1);
      let denominator = BigInt(getNthLeadingInteger(target));

      // loop while a solution is not found
      while (!isSolution(numerator, denominator)) {
        numerator = BigInt(1);
        denominator = BigInt(getNthLeadingInteger(target));
        // find the convergent at the `target` index by using backtracking
        for (let i = target - 1; i >= 1; i--) {
          const nextLeadingInteger = getNthLeadingInteger(i);
          [numerator, denominator] = [BigInt(denominator), BigInt(nextLeadingInteger) * BigInt(denominator) + BigInt(numerator)];
        }
        numerator += (denominator * BigInt(floor));
        target++;
      }

      if (numerator > largestSolution) {
        largestSolution = numerator;
        ANSWER = D;
      }
    }
    return ANSWER;
  },

  /**
   * Problem 67 Maximum Path Sum II
   *
   * By starting at the top of the triangle below and moving to adjacent numbers on the row below, the maximum total from top to bottom is 23.
   *
   *    3
   *   7 4
   *  2 4 6
   * 8 5 9 3
   *
   * That is, 3 + 7 + 4 + 9 = 23.
   *
   * @question Find the maximum total from top to bottom in [triangle.txt]((https://github.com/zheng214/euler/blob/master/euler/7/p067_triangle.txt)),
   * @question a 15K text file containing a triangle with one-hundred rows.
   */
  e67() {
    const rows = fs.readFileSync(path.join(__dirname, './p067_triangle.txt'))
      .toString()
      .split('\n')
      .map(row => row.split(' ').map(Number));

    // keeps track of the maximum score from the top to each number in the previous row
    let previousRowScores = [];

    rows.forEach((row, rowIndex) => {
      const currentRowScores = [];
      row.forEach((number, position) => {
        const isFirst = position === 0;
        const isLast = position === row.length - 1;
        if (rowIndex === 0) {
          // first row: score is just the number
          currentRowScores[0] = number;
        } else if (isFirst) {
          // first number of row: score is the score of the first element of previous row + this number
          currentRowScores[0] = previousRowScores[0] + number;
        } else if (isLast) {
          // last number of row: same as above
          currentRowScores[position] = previousRowScores[position - 1] + number;
        } else {
          const leftParent = previousRowScores[position - 1];
          const rightParent = previousRowScores[position];
          if (leftParent > rightParent) {
            // if the number is in the middle of a row (not first nor last), simply check which 'parent' is larger
            currentRowScores[position] = number + leftParent;
          } else {
            currentRowScores[position] = number + rightParent;
          }
        }
      });
      previousRowScores = currentRowScores;
    });

    return Math.max(...previousRowScores);
  },

  /**
   * Problem 68 Magic 5-gon ring
   *
   * [tldr; solving magic square variants](https://projecteuler.net/problem=68)
   *
   * @question What is the maximum 16-digit string for a "magic" 5-gon ring?
   */
  e68() {
    // The first step consists of generating the list of permutations of digits in the inner and outer ring
    const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const innerPermutations = [];
    const outerPermutations = [];
    for (let i1 = 1; i1 <= 5; i1++) {
      for (let i2 = i1 + 1; i2 <= 6; i2++) {
        for (let i3 = i2 + 1; i3 <= 7; i3++) {
          for (let i4 = i3 + 1; i4 <= 8; i4++) {
            for (let i5 = i4 + 1; i5 <= 9; i5++) {
              const innerRing = [i1, i2, i3, i4, i5];
              innerPermutations.push(innerRing);
              outerPermutations.push(DIGITS.filter(x => !innerRing.includes(x)));
            }
          }
        }
      }
    }

    let maxSolution = 0;
    // then, for each permutation, we check if it is a legitimate solution with the helper function below
    for (let i = 0; i < innerPermutations.length; i++) {
      const leadingDigit = innerPermutations[i][0];
      const basePermutation = innerPermutations[i].slice(1);
      const outerDigits = outerPermutations[i];
      for (let j = 1; j <= 24; j++) {
        const currentPermutation = utils.getLexicographicPermutation(basePermutation, j).map(Number);
        currentPermutation.unshift(leadingDigit);
        const commonSum = findSolution(currentPermutation, outerDigits);
        if (commonSum) {
          // if a soution is found, find maximal string corresponding to that solution
          // first, find the index of the inner ring adjacent to the smallest outer digit
          const innerStartIndex = currentPermutation.findIndex((permDigit, permIndex) => {
            const currentInnerDigit = permDigit;
            const nextInnerDigit = currentPermutation[(permIndex + 1) % 5];
            return currentInnerDigit + nextInnerDigit === commonSum - outerDigits[0];
          });

          // then we go around the inner ring (clockwise) and preppend the corresponding outer digit
          let solutionString = '';
          for (let k = 0; k <= 4; k++) {
            const currentInnerRingDigit = currentPermutation[(innerStartIndex + k) % 5];
            const nextInnerRingDigit = currentPermutation[(innerStartIndex + k + 1) % 5];
            const currentSum = currentInnerRingDigit + nextInnerRingDigit;
            const correspondingOuterDigit = commonSum - currentSum;
            solutionString += `${correspondingOuterDigit}${currentInnerRingDigit}${nextInnerRingDigit}`;
          }
          const solution = +solutionString;
          if (solution > maxSolution) {
            maxSolution = solution;
          }
        }
      }
    }

    return maxSolution;

    // given a sequence of inner ring, return the common sum if a solution exists, false otherwise
    function findSolution(inner, outer) {
      // we go around the inner ring and extract all the sums of adjacent digits
      const sumsToTest = [...inner].reduce(
        (acc, curr, idx, arr) => {
          const nextIndex = idx === 4 ? 0 : idx + 1;
          const sum = curr + inner[nextIndex];
          if (acc[sum]) {
            // if there are duplicate sums in the inner ring, a solution cannot exist as the outer ring numbers are all disinct
            arr.splice(1);
            return null;
          }
          acc[sum] = true;
          return acc;
        },
        {},
      );

      if (!sumsToTest) { // duplicate sums detected
        return false;
      }

      // the digits of the outer ring are sorted from smallest to largest by design
      // therefore we sort the sums of the inner ring from largest to smallest
      const partialSums = Object.keys(sumsToTest).map(Number).sort((a, b) => b - a);
      const SOLUTION_SUM = partialSums[4] + 10; // smallest inner sum + 10

      // we check if adding the corresponding index of the outer ring will result in the solution sum
      for (let i = 0; i <= 3; i++) {
        if (partialSums[i] + outer[i] !== SOLUTION_SUM) {
          return false;
        }
      }

      return SOLUTION_SUM;
    }
  },

  /**
   * Problem 69 Totient Maximum
   *
   * Euler's Totient function, φ(n) [sometimes called the phi function], is used to determine the number of numbers less than n which are relatively prime to n.
   * For example, as 1, 2, 4, 5, 7, and 8, are all less than nine and relatively prime to nine, φ(9)=6.
   *
   * For n ≤ 10, n = 6 produces a maximum n/φ(n).
   * @question Find the value of n ≤ 1,000,000 for which n/φ(n) is a maximum.
   */
  e69() {
    // we use the Euler's formula for the totient function for all n <= 1 million
    // we start with n, and for each prime p divisible by n, we multiply by ((p - 1) / p)
    // the intuition is as follows:
    // let's take the number 60, which has prime divisors 2, 3, 5
    // 1. we first extract the numbers NOT divisible by 2: p = 2 => 60 * 1/2 = 30;
    // 2. of those numbers, we extract numbers NOT divisible by 3: p = 3 => 30 * 2/3 = 20;
    // 3. finally, we extract from the previous result numbers not divisible by 5: 20 * 4/5 = 16;
    // indeed, the numbers (<60) relatively prime to 60 are the numbers which are not divisible by 2, 3, or 5, and there are 16 of them

    // we also use a heuristic to cut down a majority of numbers to test:
    // since we want to maximize n/phi(n), we need to find a number which is highly divisible
    // we do that by MAXIMIZING the number of PRIME divisors, and by MINIMIZING the number itself
    // therefore, we search incrementally with products of prime numbers from smallest to largest, and we stop if the product exceeds 1 million
    // ie. 2, 2*3, 2*3*5, 2*3*5*7, etc.
    const PRIMES_TABLE = utils.generatePrimeTable(100); // product of primes < 100 is guaranteed to exceed 1 million
    const PRIMES_ARR = Object.keys(PRIMES_TABLE).map(Number);
    let maxTotient = 0;
    let maxTotientNumber = 0;
    for (let i = 0; i < PRIMES_ARR.length; i++) {
      const factors = PRIMES_ARR.slice(0, i + 1);
      const product = factors.reduce((a, c) => a * c, 1);
      if (product > 1000000) {
        break;
      }
      const reverseTotient = factors.reduce((a, c) => a * c / (c - 1), 1); // shortcut to calculate n/phi(n)
      if (reverseTotient > maxTotient) {
        maxTotient = reverseTotient;
        maxTotientNumber = product;
      }
    }
    return maxTotientNumber;
  },

  /**
   * Problem 70 Totient permutation
   * Euler's Totient function, φ(n), is used to determine the number of positive numbers less than or equal to n which are relatively prime to n.
   * For example, as 1, 2, 4, 5, 7, and 8, are all less than nine and relatively prime to nine, φ(9)=6.
   * The number 1 is considered to be relatively prime to every positive number, so φ(1)=1.
   * Interestingly, φ(87109)=79180, and it can be seen that 87109 is a permutation of 79180.
   * @question Find the value of n, 1 < n < 107, for which φ(n) is a permutation of n and the ratio n/φ(n) produces a minimum.
   */
  e70() {
    // to minimize n/phi(n), we need to maximize phi(n), ie. we need to find n which is not highly divisible
    // n cannot be prime as phi(n) = n - 1, and n and n - 1 cannot have the same digits

    // NOTE:
    // let p1, p2, ... pm denote the prime factors of n
    // therefore n/phi(n) := p1/(p1-1) * p2/(p2-1) * p3/(p3-1) * ... * pm/(pm-1) (1)
    // in order to minimize the equation above, we need to minimize the number of terms (as each term > 1)
    // and also minimize each term by maximizing the value of the prime factors
    const PRIMES_TABLE = utils.generatePrimeTable(10000);
    // this number is chosen with the confidence that the minimal ratio < 1.001
    const PRIMES_ARR = Object.keys(PRIMES_TABLE).reverse().map(Number);
    let minimalTotientRatio = 1.001; // arbitrarily large number
    let minimalTotientNumber = 0;
    for (let i = 0; i < PRIMES_ARR.length - 1; i++) {
      const p1 = PRIMES_ARR[i];
      const phi1 = p1 / (p1 - 1);
      if (phi1 > minimalTotientRatio) {
        break;
      }
      for (let j = PRIMES_ARR.findIndex(x => x < 10000000 / p1); j < PRIMES_ARR.length; j++) {
        const p2 = PRIMES_ARR[j];
        const phi2 = p2 / (p2 - 1);
        if (phi2 > minimalTotientRatio) {
          break;
        }
        const result = p1 * p2;
        const phi = (p1 - 1) * (p2 - 1);
        if (utils.haveSameDigits([result, phi])) {
          const totientRatio = result / phi;
          if (totientRatio < minimalTotientRatio) {
            minimalTotientRatio = totientRatio;
            minimalTotientNumber = result;
          }
        }
      }
    }
    return minimalTotientNumber;
  },
};
