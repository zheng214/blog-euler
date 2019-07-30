module.exports = {
  /**
   * Problem 51
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
        for (let repl = 0; repl <= 9; repl++) {
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
};
