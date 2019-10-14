module.exports = {
  /**
   * Problem 81 Path sum: two ways
   *
   * In the 5 by 5 matrix below, the minimal path sum from the top left to the bottom right, by only moving to the right and down,
   * is indicated in bold and is equal to 2427.
   *
   * **131** **673** 234 103 018
   * 201 **096** **342** 965 150
   * 630 803 **746** **422** 111
   * 537 699 497 **121** 956
   * 805 732 524 **037** **331**
   *
   * @question Find the minimal path sum, in matrix.txt, a text file containing a 80 by 80 matrix, from the top left to the bottom right by only moving right and down.
   */
  e81() {
    // we use a memoized table where the entry [i,j] is the optimal path from 0,0 to i,j
    // MEM[i, j] = min(MEM[i - 1, j], MEM[i, j - 1]);
    const MEM = utils.initTable(80, 80);
    const raw = fs.readFileSync(path.join(__dirname, './p081_matrix.txt')).toString();
    const MATRIX = raw.split('\n').slice(0, 80).map(row => row.split(',').map(Number));
    MEM[0] = MATRIX[0].map((_, i) => utils.sumArray(MATRIX[0].slice(0, i + 1)));
    for (let row = 1; row < 80; row++) {
      MEM[row][0] = MATRIX[0][0] + utils.sumArray(MATRIX.map(r => r[0]).slice(1, row + 1));
      for (let col = 1; col < 80; col++) {
        MEM[row][col] = MATRIX[row][col] + Math.min(MEM[row - 1][col], MEM[row][col - 1]);
      }
    }
    return MEM[79][79];
  },

  /**
   * Problem 82 Path sum: three ways
   *
   * The minimal path sum in the 5 by 5 matrix below, by starting in any cell in the left column and finishing in any cell in the right column,
   * and only moving up, down, and right, is indicated in bold; the sum is equal to 994.
   *
   * 131 673 **234** **103** **018**
   * **201** **096** **342** 965 150
   * 630 803 746 422 111
   * 537 699 497 121 956
   * 805 732 524 037 331
   *
   * @question Find the minimal path sum, in [matrix.txt](https://github.com/zheng214/euler/blob/master/euler/9/p082_matrix.txt), a 31K text file containing a 80 by 80 matrix, from the left column to the right column.
   */
  e82() {
    // we iterate column by column, at each step we memorize the optimal sum from the leftmost column to
    // each element of the current column
    const raw = fs.readFileSync(path.join(__dirname, './p081_matrix.txt')).toString();
    // parse file into a 2D array
    const MATRIX = raw.split('\n').slice(0, 80).map(row => row.split(',').map(Number));
    // initiate MEM to be the first column
    let MEM = MATRIX.map(x => x[0]);
    // at each iteration, MEM[k] remembers the optimal sum from the leftmost column (any starting row)
    // to the kth element of the current column
    for (let col = 1; col < MATRIX.length; col++) {
      // extract current column
      const column = MATRIX.map(x => x[col]);
      // keep the data for the next column separate, as we still need the data of current column
      const nextMEM = [];
      // find optimal path for each element of column
      for (let dest = 0; dest < MATRIX.length; dest++) {
        // keep track of optimal path
        let optimalSum = Infinity;
        // calculate all paths from each element of previous column
        let pathSum = 0;
        for (let origin = 0; origin < MATRIX.length; origin++) {
          // calculate all paths from a specific origin row to a specific destination row
          // paths can only be: 1. go right and up, or 2. go right and down

          // if the memorized value at `origin` index is already exceeding the optimal sum, we can ignore it
          if (MEM[origin] > optimalSum) {
            continue;
          }

          if (origin === dest) {
            // if origin row is the same as destination row, the optimal path is just move right
            pathSum = MEM[origin] + column[dest];
          } else if (origin > dest) {
            // origin is 'lower' (high index == low height) than dest in matrix, move right then up
            pathSum = MEM[origin] + utils.sumArray(column.slice(dest, origin + 1));
          } else {
            // origin is 'higher' than dest in matrix, move right then down
            pathSum = MEM[origin] + utils.sumArray(column.slice(origin, dest + 1));
          }
          if (pathSum < optimalSum) {
            optimalSum = pathSum;
          }
        }
        // memoize optimal sum
        nextMEM[dest] = optimalSum;
      }
      // prepare for next column
      MEM = nextMEM;
    }
    // at the last column, MEM contains all the OPTIMAL paths from the first column to each element of the last column
    // the minimal element will then be the optimal path from left to right
    return Math.min(...MEM);
  },
};
