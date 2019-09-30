module.exports = {
  /**
   * Problem 51 Prime digit replacements
   * By replacing the 1st digit of the 2-digit number *3, it turns out that six of the nine possible values:
   * 13, 23, 43, 53, 73, and 83, are all prime.
   *
   * By replacing the 3rd and 4th digits of 56**3 with the same digit, this 5-digit number is the first example
   * having seven primes among the ten generated numbers, yielding the family:
   * 56003, 56113, 56333, 56443, 56663, 56773, and 56993. Consequently 56003, being the first member of this family,
   * is the smallest prime with this property.
   *
   * @question Find the smallest prime which, by replacing part of the number (not necessarily adjacent digits) with the same digit,
   * @question is part of an eight prime value family.
   */
  e51() {
    // define * as the "variable" part, and the rest of digits as the "fixed" part
    // the number of * must be a multiple of 3, as otherwise there will be at least 3 numbers in each family which will be divisble by 3
    // because the sum of their digits will be a multiple of 3.
    // we first try with 3 variable digits and 3 fixed digits or less;
    const candidates = [];
    for (let fixedDigits = 1; fixedDigits <= 999; fixedDigits++) {
      // for each fixed set of digits, generate the list of combinations comprising of fixed digits and *'s
      const binomialCombinations = utils.computeBinomialCombinations(fixedDigits, '***');
      for (let i = 0; i < binomialCombinations.length; i++) {
        const family = [];
        let composites = 0;
        for (let repl = 0; repl <= 9; repl++) { // replacement
          if (repl !== 0 || binomialCombinations[i][0] !== '*') { // leading 0's aren't valid
            const familyMember = +binomialCombinations[i].join('').replace(/\*/g, repl);
            if (utils.isPrime(familyMember)) {
              family.push(familyMember);
              if (family.length >= 8) {
                candidates.push(family);
              }
            } else {
              composites++;
              if (composites >= 3) {
                break;
              }
            }
          }
        }
      }
    }
    // from the list of candidates, return the family with the smallest member
    return Math.min(candidates.map(x => x[0]));
  },

  /**
   * Problem 52 Permuted multiples
   * It can be seen that the number, 125874, and its double, 251748, contain exactly the same digits, but in a different order.
   * @question Find the smallest positive integer, x, such that 2x, 3x, 4x, 5x, and 6x, contain the same digits.
   */
  e52() {
    // let d denote the number of digits of a number,
    // for each d = 2, 3, 4, 5, 6, 7, ...
    // we only need to check up to 10^d/6 as number greater than this will overflow an extra digit
    // optimizations:
    // 1. we can skip numbers which ends with a 0, since if such a number is qualified,
    // we would already have found a qualified number by dividing this number by 10
    // 2. we can skip even numbers which do not contain 0, as multiplying by 5 will produce a 0 in the result
    // and we can skip odd numbers which do not contain a 5
    // 3. we can skip numbers which do not contain any digit greater than 5, as multiplying by 2 will double the digit sum of the result
    // return console.log(containSameDigits(142857, 285714, 5))

    // search between 2 to 8 digits
    for (let d = 1; d <= 7; d++) {
      // define search range for a particular d
      const min = 10 ** d;
      const max = Math.floor((10 ** (d + 1)) / 6);
      let even = false;
      for (let n = min; n <= max; n++) {
        even = !even; // we flip the parity flag instead of checking for parity each time
        if (!canSkip(n, d, even)) { // skip numbers which fulfill the criteria above
          let failed = false;
          for (let m = 2; m <= 6; m++) {
            const product = m * n;
            if (!containSameDigits(product, n, d)) {
              failed = true;
              break;
            }
          }
          if (!failed) {
            return n;
          }
          // if all tests pass, return result
        }
      }
    }

    // return true if a contains the same digits of b, where d := number of digits - 1
    function containSameDigits(a, b, d) {
      const balanceArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      // index of this arr represents the digit found in a and b
      // content of an index i represents the number of occurrences of digit i in a minus the number of occurrences of digit i in b
      // a and b contain the same digits if, at the end, this array contains all 0s
      for (let i = 0; i <= d; i++) {
        balanceArr[+a.toString().charAt(i)]++;
        balanceArr[+b.toString().charAt(i)]--;
      }
      return balanceArr.every(x => x === 0);
    }

    // evaluates if a number is skippable
    function canSkip(number, digits, even) {
      const stringNumber = number.toString();
      if (stringNumber.charAt(digits) === '0') {
        return true;
      }
      if (even && !stringNumber.includes('0')) {
        return true;
      }
      if (!even && !stringNumber.includes('5')) {
        return true;
      }
      if (stringNumber.split('').every(x => +x < 5)) {
        return true;
      }
      return false;
    }
  },

  /**
   * Problem 53 Combinatorics selections
   * There are exactly ten ways of selecting three from five, 12345:
   * 123, 124, 125, 134, 135, 145, 234, 235, 245, and 345
   * In combinatorics, we use the notation, C(5, 3) = 10
   * In general, C(n, r) = n!/(r!(n−r)!), where r ≤ n
   * It is not until n=23, that a value exceeds one-million: C(23, 10)=1144066.
   * @question How many, not necessarily distinct, values of C(n, r) for 1 ≤ n ≤ 100, are greater than one-million?
   */
  e53() {
    // we generate the table of 100 x 100 where each cell, row i, column j holds the result C(i, j)
    // instead of calculating each combination using the formula, we can use basic algebra for the follow update rules:
    // 1. C(n + 1, r) = C(n, r) * N where N = (n+1)/(n-r+1)
    // 2. C(n, r + 1) = C(n, r) * R where R = (n-r)/(r+1) => C(n, r - 1) = C(n, r) * r/(n-r+1)
    // we also know that C(n, r) is greater than one million for all n >= 23 and r = 10, so we don't need to check for r > 10
    let totalCount = 4; // for n = 23, obvious from problem statement
    const combinationTable = new Array(101); // for convenience, n = 0 ... 100
    for (let i = 23; i <= 100; i++) {
      combinationTable[i] = new Array(11); // r = 0 ... 10
    }
    combinationTable[23][10] = 1144066;
    for (let n = 24; n <= 100; n++) { // we can start at 24 given by problem statement
      for (let r = 10; r > 0; r--) {
        if (r === 10 && n !== 23) {
          combinationTable[n][r] = combinationTable[n - 1][r] * n / (n - r);
        } else {
          combinationTable[n][r] = combinationTable[n][r + 1] * (r + 1) / (n - r);
        }
        if (combinationTable[n][r] < 1000000) {
          const increment = utils.isEven(n)
            ? 1 + 2 * (n / 2 - r - 1)
            : 2 * ((n + 1) / 2 - r - 1);
          totalCount += increment;
          break;
        }
      }
    }
    return totalCount;
  },

  /**
   * Problem 54 Poker hands
   *
   * In the card game poker, a hand consists of five cards and are ranked, from lowest to highest, in the following way:
   *
   * High Card: Highest value card.
   * One Pair: Two cards of the same value.
   * Two Pairs: Two different pairs.
   * Three of a Kind: Three cards of the same value.
   * Straight: All cards are consecutive values.
   * Flush: All cards of the same suit.
   * Full House: Three of a kind and a pair.
   * Four of a Kind: Four cards of the same value.
   * Straight Flush: All cards are consecutive values of same suit.
   * Royal Flush: Ten, Jack, Queen, King, Ace, in same suit.
   *
   * The cards are valued in the order:
   * 2, 3, 4, 5, 6, 7, 8, 9, 10, Jack, Queen, King, Ace.
   *
   * If two players have the same ranked hands then the rank made up of the highest value wins;
   * for example, a pair of eights beats a pair of fives (see example 1 below). But if two ranks tie
   * for example, both players have a pair of queens, then highest cards in each hand are compared;
   * if the highest cards tie then the next highest cards are compared, and so on.
   *
   * The file, poker.txt, contains one-thousand random hands dealt to two players. Each line of the file contains ten cards
   * (separated by a single space): the first five are Player 1's cards and the last five are Player 2's cards.
   *
   * You can assume that all hands are valid (no invalid characters or repeated cards), each player's hand is in no specific order,
   * and in each hand there is a clear winner.
   *
   * @question How many hands does Player 1 win?
   */
  e54() {
    // list of possible ranks
    const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 'T', 'J', 'Q', 'K', 'A'];

    // generate the list of combinations of straights and all their combinations
    // the keys of the table are the valid combinations of strings of 5 characters (not necessarily in order) which form a straight, ie. J8TQ9
    // the value of each key is the highest rank of that straight
    // note: this method may not be the fastest solution for this problem, but it is much more scalable (eg. 1 million hands instead of 1000)
    const STRAIGHTS_TABLE = ['A', ...RANKS].reduce( // ace to ace
      (table, curr, index, arr) => {
        if (curr === 'J') {
          arr.splice(1);
        }
        const highest = index + 5;
        const base = arr.slice(index, index + 5);
        for (let i = 0; i <= 120; i++) {
          table[utils.getLexicographicPermutation(base, i).join('')] = highest;
        }
        return table;
      },
      {},
    );

    const GAMES = fs.readFileSync(path.join(__dirname, 'p054_poker.txt')).toString().split('\n');

    return GAMES.reduce((p1Score, currentGame) => {
      const [p1Hand, p2Hand] = [currentGame.substring(0, 14), currentGame.substring(15, 29)];
      if (!p1Hand) { // end of games
        return p1Score;
      }
      const [p1HandValue, p2HandValue] = [evaluateHand(p1Hand), evaluateHand(p2Hand)];
      for (let i = 0; i < p1HandValue.length; i++) {
        if (p1HandValue[i] > p2HandValue[i]) {
          return p1Score + 1;
        }
        if (p1HandValue[i] < p2HandValue[i]) {
          return p1Score;
        }
      }
      return p1Score;
    }, 0);

    // input: string of 5 cards, separated by a space
    // output: score of hand, which is an array of size up to 6
    // first element is the rank of the hand, where 9: straight flush, 8: four of a kind, etc.
    // second element is the value of the first type within that rank, ie. a hand with 4 aces will have value 13, a hand with 4 kings value 12, etc.
    // third element is the value of the second type within that rank, ie. if both players have 2 pair of aces and 3 singles, then we compare the
    // second highest value etc.
    function evaluateHand(hand) {
      const cards = hand.split(' ');
      // FLUSH check
      // check if every card has the same suit as the first card
      const firstSuit = cards[0].charAt(1);
      const isFlush = cards.every(card => card.charAt(1) === firstSuit);

      // STRAIGHT check
      // check the generated table of all possible straights
      const highestStraight = STRAIGHTS_TABLE[cards.map(card => card.charAt(0)).join('')] || false;

      // same of a kind table, keys are the ranks, values are the number of occurences of that rank
      const rankTable = cards.reduce((table, currentCard) => {
        const rank = currentCard.charAt(0);
        table[rank] = table[rank] ? table[rank] + 1 : 1;
        return table;
      }, {});

      // inverted table of above, keys are occurrences and corresponding values are the ranks that fit that occurrence
      const occurencesTable = Object.entries(rankTable).reduce((table, [key, value]) => {
        if (table[value]) {
          table[value].push(key);
        } else {
          table[value] = [key];
        }
        return table;
      }, {});

      // now that we have all the variables we need, we attempt to match a hand with each hand type from strongest to weakest

      // STRAIGHT FLUSH
      if (highestStraight && isFlush) {
        return [9, getRank(highestStraight)];
      }

      // FOUR OF A KIND
      if (occurencesTable['4']) {
        return [8, getRank(occurencesTable['4'][0]), getRank(occurencesTable['1'])];
      }

      // FULL HOUSE
      if (occurencesTable['3'] && occurencesTable['2']) {
        return [7, getRank(occurencesTable['3'][0]), getRank(occurencesTable['2'][0])];
      }

      // FLUSH
      if (isFlush) {
        return [6, ...occurencesTable['1'].map(getRank).sort(sortBiggest)];
      }

      // STRAIGHT
      if (highestStraight) {
        return [5, getRank(highestStraight)];
      }

      // THREE OF A KIND
      if (occurencesTable['3']) {
        return [4, getRank(occurencesTable['3'][0]), ...occurencesTable['1'].map(getRank).sort(sortBiggest)];
      }

      // TWO PAIRS
      if (occurencesTable['2'] && occurencesTable['2'].length === 2) {
        return [3, ...occurencesTable['2'].map(getRank).sort(sortBiggest), getRank(occurencesTable['1'][0])];
      }

      // ONE PAIR
      if (occurencesTable['2']) {
        return [2, getRank(occurencesTable['2'][0]), ...occurencesTable['1'].map(getRank).sort(sortBiggest)];
      }

      // HIGH CARD
      return [1, ...occurencesTable['1'].map(getRank).sort(sortBiggest)];
    }

    function sortBiggest(a, b) {
      return b - a;
    }

    // returns the numerical rank of a card from a character
    function getRank(card) {
      if (+card) {
        return +card;
      }
      return {
        T: 10,
        J: 11,
        Q: 12,
        K: 13,
        A: 14,
      }[card];
    }
  },

  /**
   * Problem 55 Lychrel numbers
   *
   * If we take 47, reverse and add, 47 + 74 = 121, which is palindromic.
   *
   * Not all numbers produce palindromes so quickly. For example,
   * 349 + 943 = 1292,
   * 1292 + 2921 = 4213
   * 4213 + 3124 = 7337
   *
   * That is, 349 took three iterations to arrive at a palindrome.
   *
   * Although no one has proved it yet, it is thought that some numbers, like 196, never produce a palindrome. A number that never forms a palindrome
   * through the reverse and add process is called a Lychrel number. Due to the theoretical nature of these numbers, and for the purpose of this problem,
   * we shall assume that a number is Lychrel until proven otherwise. In addition you are given that for every number below ten-thousand, it will either
   * (i) become a palindrome in less than fifty iterations, or,
   * (ii) no one, with all the computing power that exists, has managed so far to map it to a palindrome.
   * 10677 is the first number to be shown to require over fifty iterations before producing a palindrome: 4668731596684224866951378664 (53 iterations, 28-digits).
   *
   * Surprisingly, there are palindromic numbers that are themselves Lychrel numbers; the first example is 4994.
   *
   * @question How many Lychrel numbers are there below ten-thousand?
   */
  e55() {
    const lychrelNumbers = {}; // memoized table for all lychrel numbers (doesnt terminate)
    const nonLychrelNumbers = {}; // numbers which produce a palindrom through reverse add

    for (let n = 1; n <= 10000; n++) {
      testLychrel(n);
    }

    function testLychrel(n) {
      const encounteredNumbers = {};
      let sum = n;
      for (let i = 1; i <= 50; i++) {
        const flipped = utils.flip(sum);
        encounteredNumbers[sum] = true;
        if (sum % 10) {
          encounteredNumbers[flipped] = true;
        }
        if (nonLychrelNumbers[sum]) {
          Object.assign(nonLychrelNumbers, encounteredNumbers);
          break;
        }
        if (lychrelNumbers[sum] || i === 50) {
          Object.assign(lychrelNumbers, encounteredNumbers);
          break;
        }
        sum += flipped;
        if (utils.isPalindrome(sum)) {
          Object.assign(nonLychrelNumbers, encounteredNumbers);
          break;
        }
      }
    }

    return Object.keys(lychrelNumbers).filter(x => x <= 10000).length;
  },

  /**
   * Problem 56 Powerful digit sum
   *
   * A googol (10^100) is a massive number: one followed by one-hundred zeros;
   * 100^100 is almost unimaginably large: one followed by two-hundred zeros.
   * Despite their size, the sum of the digits in each number is only 1.
   *
   * @question Considering natural numbers of the form, ab, where a, b < 100, what is the maximum digital sum?
   */
  e56() {
    const expTable = [...Array(99)].map((x, i) => [(i + 1).toString()]); // initialize
    let largestDigitSum = 0;

    expTable.forEach((column, colIndex) => {
      const base = colIndex + 1;
      // each column i contains the result of [i ^ 1, i ^ 2, ..., i ^ 99]
      // we will skip numbers < 10 and multiples of 10
      if (base < 10 || base % 10 === 0) {
        return null;
      }
      for (let exp = 1; exp <= 99; exp++) {
        const result = BigInt(column[exp - 1]) * BigInt(base);
        // const result = longMultiply(column[exp - 1], base.toString());
        const digitSum = utils.sumArray(result, x => +x);
        if (digitSum > largestDigitSum) {
          largestDigitSum = digitSum;
        }
        column.push(result.reverse().join(''));
      }
    });

    return largestDigitSum;

    // takes 2 strings of numbers as params, returns an array containing the digits of the product of the 2 numbers
    // multiplies the 2 numbers using long multiplication
    // is obsolete when BigInt gets pass stage 3
    function longMultiply(a, b) {
      const mTable = {};
      const [n1, n2] = [a.split('').reverse(), b.split('').reverse()];
      const partialResultsTable = n2.reduce(
        (acc, curr, idx) => {
          if (curr) {
            const power = idx;
            const results = mTable[curr] || n1.map(x => x * curr);
            mTable[curr] = results;
            results.forEach((partialProduct, i) => {
              if (!acc[power + i + 1]) acc[power + i + 1] = [];
              if (partialProduct < 10) {
                acc[power + i].push(partialProduct);
              } else {
                acc[power + i].push(partialProduct.toString().split('')[1]);
                acc[power + i + 1].push(partialProduct.toString().split('')[0]);
              }
            });
          }
          return acc;
        },
        [[]],
      );
      // add the digits with respect to their positions
      return consolidatePartialResults(partialResultsTable);
    }

    function consolidatePartialResults(table) {
      const flatResults = [];
      let carry = 0;
      for (let columnIndex = 0; columnIndex < table.length; columnIndex++) {
        const col = table[columnIndex];
        const sum = (col.reduce((a, c) => +c + a, 0) + +carry).toString();
        const retainedDigit = sum.slice(-1);
        carry = sum.slice(0, sum.length - 1);
        flatResults.push(retainedDigit);
      }
      return flatResults;
    }
  },

  /**
   * Problem 57 Square root convergents
   * It is possible to show that the square root of two can be expressed as an infinite continued fraction.
   * sqrt(2) = 1 + 1 / (2 + 1 / (2 + 1 / (2 + ...)))
   *
   * By expanding for the first three iterations. we get:
   *
   * 1 + 1 / 2 = 3/2 = 1.5
   * 1 + 1 / (2 + 1 / 2) = 7/5 = 1.4
   * 1 + 1 / (2 + 1 / (2 + 1 / 2)) = 17/12 = 1.41666
   *
   * The next three expansions are 41/29, 99/70, and 239/169, but the 8th expansion, 1393/985, is the first exmaple where the number of digits
   * in the numerator exceeds the number of digits in the denominator.
   *
   * @question In the first one-thousand expansions, how many fractions contain a numerator with more digits than the denominator?
   */
  e57() {
    let currentExpansion = [3n, 2n];
    let numeratorDigitExcessCount = 0;

    for (let i = 1; i < 1000; i++) {
      currentExpansion = computeNextCF(currentExpansion);
      if (currentExpansion[0].toString().length > currentExpansion[1].toString().length) {
        numeratorDigitExcessCount++;
      }
    }

    // compute the next continued fraction expansion based on the current expansion
    function computeNextCF([n, d]) {
      return [2n * d + n, d + n];
    }

    return numeratorDigitExcessCount;
  },

  /**
   * Problem 58 Spiral Primes
   * Starting with 1 and spiralling anticlockwise in the following way, a square spiral with side length 7 is formed.
   *
   * 37 36 35 34 33 32 31
   * 38 17 16 15 14 13 30
   * 39 18  5  4  3 12 29
   * 40 19  6  1  2 11 28
   * 41 20  7  8  9 10 27
   * 42 21 22 23 24 25 26
   * 43 44 45 46 47 48 49
   * It is interesting to note that the odd squares lie along the bottom right diagonal, but what is more interesting is that
   * 8 out of the 13 numbers lying along both diagonals are prime; that is, a ratio of 8/13 ≈ 62%.
   *
   * If one complete new layer is wrapped around the spiral above, a square spiral with side length 9 will be formed.
   *
   * @question If this process is continued, what is the side length of the square spiral for which the ratio of primes along both diagonals first falls below 10%?
   */

  e58() {
    // generate a table of 1 million primes
    // const PRIMES = utils.generatePrimeTable(10000000);

    // start from the second layer
    let currentNumber = 9;
    let primes = 3;
    let diagonals = 5;
    let sideLength = 3;

    while (`${primes}0` >= diagonals) {
      sideLength += 2;
      diagonals += 4;
      const incr = sideLength - 1;
      for (let i = 0; i < 4; i++) {
        currentNumber += incr;
        if (utils.isPrime(currentNumber)) {
          primes++;
        }
      }
    }

    return sideLength;
  },

  /**
   * Problem 59 XOR decryption
   *
   * Each character on a computer is assigned a unique code and the preferred standard is ASCII (American Standard Code for Information Interchange).
   * For example, uppercase A = 65, asterisk (*) = 42, and lowercase k = 107.
   *
   * A modern encryption method is to take a text file, convert the bytes to ASCII, then XOR each byte with a given value, taken from a secret key.
   * The advantage with the XOR function is that using the same encryption key on the cipher text, restores the plain text;
   * for example, 65 XOR 42 = 107, then 107 XOR 42 = 65.
   *
   * For unbreakable encryption, the key is the same length as the plain text message, and the key is made up of random bytes.
   * The user would keep the encrypted message and the encryption key in different locations, and without both "halves", it is impossible to decrypt the message.
   *
   * Unfortunately, this method is impractical for most users, so the modified method is to use a password as a key.
   * If the password is shorter than the message, which is likely, the key is repeated cyclically throughout the message.
   * The balance for this method is using a sufficiently long password key for security, but short enough to be memorable.
   *
   * Your task has been made easy, as the encryption key consists of three lower case characters.
   * @question Using p059_cipher.txt, a file containing the encrypted ASCII codes, and the knowledge that the plain text must contain common English words,
   * @question decrypt the message and find the sum of the ASCII values in the original text.
   */
  e59() {
    // we start by compiling a list of valid password characters for each position
    // we check each character of the password one by one, that is, we start with 'a', and we XOR it with the 1st, 4th, 7th, etc. characters of the cyphertext
    // if at any point we xor a resulting character which is not a valid character for english text, ie. a-z, A-Z and punctuations, we discard it
    // we repeat for the second and third character of the password p059_cipher.txt
    const formatted = fs.readFileSync('6/p059_cipher.txt').toString().split(',').map(x => +x);
    const filtered = {
      first: formatted.filter((_, i) => i % 3 === 0), // every third ascii starting from pos 0
      second: formatted.filter((_, i) => i % 3 === 1), // every third ascii starting from pos 1
      third: formatted.filter((_, i) => i % 3 === 2), // every third ascii starting from pos 2
    };

    const validPass = {
      first: [],
      second: [],
      third: [],
    };

    for (let i = 97; i <= 122; i++) {
      if (isPassValid(i, 'first')) {
        validPass.first.push(i);
      }
      if (isPassValid(i, 'second')) {
        validPass.second.push(i);
      }
      if (isPassValid(i, 'third')) {
        validPass.third.push(i);
      }
    }

    function isAsciiValid(ascii) {
      return (ascii >= 32 && ascii <= 90) || (ascii >= 97 && ascii <= 122) || ascii === 91 || ascii === 93;
    }

    function isPassValid(code, startPosition) {
      const encryptedChars = filtered[startPosition];
      const isValid = encryptedChars.every((x) => {
        return isAsciiValid((x ^ code));
      });
      return isValid;
    }

    // console.log(validPass) // this will yield { first: [101], second: [120], third: [112] }
    const password = [101, 120, 112];

    const plaintext = formatted.map((char, i) => char ^ password[i % 3]);
    // console.log(String.fromCharCode(...plaintext)); // this will yield the following plaintext output
    /*
    An extract taken from the introduction of one of Euler's most celebrated papers, "De summis serierum reciprocarum" [On the sums of series of reciprocals]: I have
    recently found, quite unexpectedly, an elegant expression for the entire sum of this series 1 + 1/4 + 1/9 + 1/16 + etc., which depends on the quadrature of the
    circle, so that if the true sum of this series is obtained, from it at once the quadrature of the circle follows. Namely, I have found that the sum of this series
    is a sixth part of the square of the perimeter of the circle whose diameter is 1; or by putting the sum of this series equal to s, it has the ratio sqrt(6) multiplied
    by s to 1 of the perimeter to the diameter. I will soon show that the sum of this series to be approximately 1.644934066842264364; and from multiplying this number
    by six, and then taking the square root, the number 3.141592653589793238 is indeed produced, which expresses the perimeter of a circle whose diameter is 1. Following
    again the same steps by which I had arrived at this sum, I have discovered that the sum of the series 1 + 1/16 + 1/81 + 1/256 + 1/625 + etc. also depends on the
    quadrature of the circle. Namely, the sum of this multiplied by 90 gives the biquadrate (fourth power) of the circumference of the perimeter of a circle whose
    diameter is 1. And by similar reasoning I have likewise been able to determine the sums of the subsequent series in which the exponents are even numbers.
    */
    return utils.sumArray(plaintext);
  },
};
