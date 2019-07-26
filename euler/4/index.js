module.exports = {
  /**
   * Problem 31: Coin sums
   * In England the currency is made up of pound, £, and pence, p, and there are eight coins in general circulation:
   * 1p, 2p, 5p, 10p, 20p, 50p, £1 (100p) and £2 (200p).
   * It is possible to make £2 in the following way:
   * 1×£1 + 1×50p + 2×20p + 1×5p + 1×2p + 3×1p
   *
   * @question How many different ways can £2 be made using any number of coins?
   */
  e31() {
    const CHANGES = [1, 2, 5, 10, 20, 50, 100, 200];
    // our final result
    let changes = 0;

    // our algorithm works by traversing down a 'tree'
    // we start with the top level: 200
    // [tree level: 200] we create 2 branches: left (using 200) and right (not using 200)
    // from each branch we find the amount of combinations of the next coin
    // [tree level: 100] left branch used 200, has 0 left, return 1 (1 way to make 200 using 200p coins)
    // [tree level: 100] right branch did not use 200, has 200 left, now we can either:
    // [tree level: 100] use 2 100p coins, 1 100p coins, or 0 100p coins, now we create 3 branches into the next level
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
   * The product 7254 is unusual, as the identity, 39 × 186 = 7254, containing multiplicand, multiplier,
   * and product is 1 through 9 pandigital.
   *
   * @question Find the sum of all products whose multiplicand/multiplier/product identity can be written as a 1 through 9 pandigital.
   * HINT: Some products can be obtained in more than one way so be sure to only include it once in your sum.
   */
  e32() {
    const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const pandigitalProducts = [];
    // let a * b = c (for convenience, assume a < b), we know that c must have 4 digits because if
    // digits(c) > 4, a * b < c and if digits(c) < 4, a * b > c
    // we just need to check values of c from 1234 to 9876, and find 1 < a <= 98 st. our condition is satisfied
    for (let i = 1111; i <= 9876; i++) {
      const selectionIndexes = i.toString().split('');
      // we only check if the selection is valid
      if (+(selectionIndexes[1]) < 9 && +(selectionIndexes[2]) < 8 && +(selectionIndexes[3]) < 7 && !selectionIndexes.some(x => x === '0')) {
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
   * The fraction 49/98 is a curious fraction, as an inexperienced mathematician in attempting to simplify
   * it may incorrectly believe that 49/98 = 4/8, which is correct, is obtained by cancelling the 9s.
   * We shall consider fractions like, 30/50 = 3/5, to be trivial examples.
   * There are exactly four non-trivial examples of this type of fraction, less than one in value, and containing two
   * digits in the numerator and denominator.
   *
   * @question If the product of these four fractions is given in its lowest common terms, find the value of the denominator.
   */
  e33() {
    // we first check all fractions of the form mx/xn, where
    // a. 1 <= m, n <= 9
    // b. m < x <= 9
    // c. m != n
    const curiousFractions = [];
    for (let m = 1; m <= 9; m++) {
      for (let n = 1; n <= 9; n++) {
        if (m !== n) {
          for (let x = m; x <= 9; x++) {
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
   * @question Find the sum of all numbers which are equal to the sum of the factorial of their digits.
   * Note: as 1! = 1 and 2! = 2 are not sums they are not included.
   */
  e34() {
    const FACTORIALS = utils.generateFactTable(9);
    const curiousNumbers = [];

    // we note that curious numbers must have between 3 and 7 digits, since 8 * 9! < 10^8
    // and we can quickly manually verify that numbers with 2 digits cannot be curious

    // for each digit count we use a heuristic to prune some numbers
    for (let d = 3; d <= 7; d++) {
      // for 3-digit numbers, we notice that
      // 1. the number cannot contain a digit > 6, since 6! = 720, and 7! (in 720) > 999
      // 2. the number must contain at least one 5, since 3 * 4! < 100
      // 3. the max number following condition 1 is 555, but 5! + 5! + 5! = 360, so our number cannot have three 5's
      // 4. we can quickly verify that our number cannot contain two 5's either, as none of them satisfies our condition
      // therefore our number must contain exactly one 5,
      // for the rest of digits below, we use the same logic applied here
      if (d === 3) {
        for (let i = 125; i <= 145; i++) {
          if (isEligible(i, 5) && isCurious(i)) curiousNumbers.push(i);
        }
      }

      // for 4-digit numbers, we have two main options, either use one 7, or no 7
      // if we use one 7, our upper bound is 7! + 3 * 6! = 7200 maximize-> 7166 -> factSum(7166) = 6481 maximize-> 6476
      // if not using 7. our uppper bound is 6! * 4 = 2880 maximize-> 2666, since the first digit <= 2
      // our upper bound becomes  2 + 6! * 3 = 2162
      // since we need to use at least 2 6's, our lower bound becomes 1266
      if (d === 4) {
        for (let i = 1266; i < 2162; i++) {
          if (isEligible(i, 6) && isCurious(i)) curiousNumbers.push(i);
        }
        for (let i = 5040; i < 6476; i++) {
          if (isEligible(i, 7) && isCurious(i)) curiousNumbers.push(i);
        }
      }

      // for 5-digit numbers, the options are to use 2 8's, 1 8, or no 8
      if (d === 5) {
        // using two 8's
        for (let i = 80640; i < 88777; i++) {
          if (isEligible(i, 8) && isCurious(i)) curiousNumbers.push(i);
        }

        // using one 8
        for (let i = 40320; i < 57778; i++) {
          if (isEligible(i, 8) && isCurious(i)) curiousNumbers.push(i);
        }

        // no 8
        for (let i = 10077; i < 17777; i++) {
          if (isEligible(i, 7) && isCurious(i)) curiousNumbers.push(i);
        }
      }

      // for 6-digit numbers, the options are to use 2 9's, 1 9, or no 9
      if (d === 6) {
        // 2 9's
        for (let i = 725799; i < 886998; i++) {
          if (isCurious(i)) curiousNumbers.push(i);
        }

        // 1 9
        for (let i = 362889; i < 488889; i++) {
          if (isCurious(i)) curiousNumbers.push(i);
        }

        // no 9
        for (let i = 100088; i < 158888; i++) {
          if (isCurious(i)) curiousNumbers.push(i);
        }
      }

      // for 7 digit numbers, we must use 4 9's
      if (d === 7) {
        // 4 9's
        for (let i = 1459999; i < 1489999; i++) {
          if (isCurious(i)) curiousNumbers.push(i);
        }
      }
    }

    function isCurious(n) {
      return utils.sumArray(n.toString().split(''), x => FACTORIALS[x]) === n;
    }

    function isEligible(n, d) {
      return !n.toString().split('').some(x => +(x) > d);
    }

    return utils.sumArray(curiousNumbers);
  },

  /**
   * Problem 35: Circular primes
   * The number, 197, is called a circular prime because all rotations of the digits: 197, 971, and 719, are themselves prime.
   * There are thirteen such primes below 100: 2, 3, 5, 7, 11, 13, 17, 31, 37, 71, 73, 79, and 97.
   *
   * @question How many circular primes are there below one million?
   */
  e35() {
    // const primeTable = utils.generatePrimeTable(1000000);
    const testedNumbers = {}; // table containing numbers we have tested to avoid duplicate testing
    const validDigits = [1, 3, 7, 9]; // any number containing a digit outside of this list will have a composite rotation
    const primeRotations = []; // result containing all rotation primes

    // we check all numbers within 3 to 6 digits
    for (let digits = 3; digits <= 6; digits++) {
      const permutationsCount = 4 ** digits;
      for (let permutation = 0; permutation < permutationsCount; permutation++) {
        // map permutation into an array of indexes specifying the digit to include at that index
        // eg. 0 -> [0, 0, 0] -> 111, 1 -> [0, 0, 1] -> 113, 5 -> [1, 0, 1] -> 313, etc.
        const permSpec = permutation.toString(4).padStart(digits, '0').split('');
        const numberToTest = permSpec.map(perm => validDigits[perm]).join('');
        if (!testedNumbers[numberToTest]) {
          let rotationIndex = 0;
          const rotations = new Set(); // we use set as rotations may be counted twice, eg. 1111
          let isRotationPrime = true;
          while (rotationIndex < digits) {
            const left = numberToTest.slice(rotationIndex, numberToTest.length);
            const right = numberToTest.slice(0, rotationIndex);
            const rotatedNumber = +(`${left}${right}`);
            rotations.add(rotatedNumber);
            if (!utils.isPrime(rotatedNumber)) {
              isRotationPrime = false;
            }
            testedNumbers[rotatedNumber] = true;
            rotationIndex++;
            if (numberToTest.split('').every(x => x === numberToTest.charAt(0))) {
              // test if all digits in number are equal. If true, no need to continue rotations
              break;
            }
          }
          if (isRotationPrime) {
            primeRotations.push(...Array.from(rotations));
          }
        }
      }
    }

    return primeRotations.length + 13; // there are 13 rotations under 13 (given)
  },

  /**
   * Problem 36: Double-base palindromes
   * The decimal number, 585 = 1001001001 (binary), is palindromic in both bases.
   * @question Find the sum of all numbers, less than one million, which are palindromic in base 10 and base 2.
   */
  e36() {
    const doublePalindromes = [];
    // we loop through each decimal palindrome and check whether its binary representation is also palindromic
    // note that even numbers cannot be palindromic in its binary representation
    for (let i = 1; i <= 999; i++) {
      // we can skip the numbers whose leading digit is even
      if (i.toString().charAt(0) & 1) {
        // we generate a list of palindromes based on current index
        // ie. i = 57 -> 5775, 57075, 57175, ..., 57975
        const evenDigitPalindrome = +(`${i.toString()}${i.toString().split('').reverse().join('')}`);
        let oddDigitPalindromes = [];
        if (i < 100) { // we don't want to generate 7 digit palindromes
          oddDigitPalindromes = [...Array(10)].map((x, idx) => +(`${i.toString()}${idx}${i.toString().split('').reverse().join('')}`));
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
   * The number 3797 has an interesting property. Being prime itself, it is possible to continuously remove digits from left to right,
   * and remain prime at each stage: 3797, 797, 97, and 7. Similarly we can work from right to left: 3797, 379, 37, and 3.
   *
   * @question Find the sum of the only eleven primes that are both truncatable from left to right and right to left.
   * NOTE: 2, 3, 5, and 7 are not considered to be truncatable primes.
   */
  e37() {
    const truncatedPrimes = [];

    // we can see that the only valid digit in a truncated prime are 1,3,7,9
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
    const queueP = [3, 7]; // queue for preppend (preppending to a 2 or 5 will automatically make a number composite)

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

        // preppending the same digit to the leading digit eg. 357 -> 3357 will result in the first 2 leading digit to be divisible by 11
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
   * 192 × 2 = 384
   * 192 × 3 = 576
   *
   * By concatenating each product we get the 1 to 9 pandigital, 192384576. We will call 192384576 the concatenated product of 192 and (1,2,3)
   *
   * The same can be achieved by starting with 9 and multiplying by 1, 2, 3, 4, and 5, giving the pandigital, 918273645, which is the
   * concatenated product of 9 and (1,2,3,4,5)
   *
   * @question What is the largest 1 to 9 pandigital 9-digit number that can be formed as the concatenated product of an integer with
   * (1,2, ... , n) where n > 1?
   */
  e38() {
    // we are given that the answer is >= 918273645
    // given that our multiplicand (m) has 2 digits, then it must be >= 91
    // successive multiplication by 1, 2, 3, 4 will yield products of 2 digits, 3 digits, 3 digits, 3 digits = 11 digits > 9 digits
    // we can apply the same logic to 3 digit multiplicands: 3 + 4 + 4 > 9
    // for 5 digits and above, the result of mulitpliying by 1 and 2 will result in a >5 and >6 digit multiplicand > 9 digits
    // so we can only check 4-digits multiplicands where m * 1 has 4 digits and m * 2 has 5 digits, 4 + 5 = 9
    // we dont have to check numbers > 9500 as multipliying by 2 will yield 19...
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
   * {20,48,52}, {24,45,51}, {30,40,50}
   * @question For which value of p ≤ 1000, is the number of solutions maximised?
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
   * 0.12345678910[1]112131415161718192021...
   * It can be seen that the 12th digit of the fractional part is 1 (enclosed in square brackets []).
   * @question If d_n represents the nth digit of the fractional part, find the value of the following expression.
   * @question d_1 × d_10 × d_100 × d_1000 × d_10000 × d_100000 × d_1000000
   */
  e40() {
    // we split the fractional part into sections, where the first section contains the numbers with one digit (1,2,3,...,9),
    // the second section contains the 2-digits numbers (11,12,...,99), etc.
    // it can be seen that each section contains 9i * 10^(i-1) digits total
    const searchIndexes = [1, 10, 100, 1000, 10000, 100000, 1000000];
    const foundDigits = [];

    let section = 1;

    let currentIndex = 0; // d_n

    while (searchIndexes.length) {
      // we find the last index of the current section
      const lastIndexOfSection = currentIndex + 9 * section * (10 ** (section - 1));
      // we find all the d_i where i < last index of current section
      while (searchIndexes[0] < lastIndexOfSection) {
        const indexToFind = searchIndexes.shift();
        // find the matching number corresponding to an index
        // e.g. for section 2: {10,11 -> 10}, {12,13 -> 11}, {14,15 -> 12}, etc
        // e.g. for section 3: {190, 190, 192 -> 100}, {193, 194, 195 -> 101}, etc.
        const matchedNumber = (10 ** (section - 1)) - 1 + Math.ceil((indexToFind - currentIndex) / section);

        // find the corresponding digit in the matched number
        // e.g. for section 2: {10 -> 1, 11 -> 0}, {12 -> 1, 13 -> 1}, {14 -> 1, 15 -> 2}, etc.
        // e.g. for section 3: {190 -> 1, 191 -> 0, 192 -> 0}, {193 -> 1, 194 -> 0, 195 -> 1}, etc.
        const matchedDigitIndex = ((indexToFind - currentIndex) % section);

        // we adjust the matched index based on the modulus
        // e.g. if the matched number has 3 digits (section 3), then we must modify the index like so:
        // 1 -> 0, 2 -> 1, 0 -> 2
        // ie. we convert index of the format
        // {1,2,0} (obtained by {1/3, 2/3, 3/3}) to
        // {0,1,2} (accurate representation of the index we want)
        const adjustedDigitIndex = matchedDigitIndex
          ? matchedDigitIndex - 1
          : matchedNumber.toString().length - 1;
        const matchedDigit = +(matchedNumber.toString().charAt(adjustedDigitIndex));
        foundDigits.push(matchedDigit);
      }
      // go to next index
      section++;
      // set the start index as the end of last section
      currentIndex = lastIndexOfSection;
    }

    return foundDigits.reduce((a, c) => a * c, 1);
  },
};
