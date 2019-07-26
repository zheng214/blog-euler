module.exports = {
  /**
   * Problem 41: Pandigital prime
   * We shall say that an n-digit number is pandigital if it makes use of all the digits 1 to n exactly once.
   * For example, 2143 is a 4-digit pandigital and is also prime.
   * @question What is the largest n-digit pandigital prime that exists?
   */
  e41() {
    // n cannot be 9, as the digits sum up to 45, and therefore divisible by 3
    // by the same logic, n cannot be 8 either
    const digits = [7, 6, 5, 4, 3, 2, 1];

    // we don't need to check if the number is prime if the finalDigit is 2, 4, 5, or 6
    const validFinalDigits = [1, 3, 7];

    // we search from n = 7 to n = 4 (given in problem statement)
    for (let n = 7; n >= 4; n--) {
      const validDigits = digits.slice(7 - n);
      // here i represents the ith lexicographic permutation
      for (let i = 1; i <= utils.fact(n); i++) {
        const pandigitalArray = utils.getLexicographicPermutation(validDigits, i);
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
};
