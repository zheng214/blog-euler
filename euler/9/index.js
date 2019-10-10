module.exports = {
  /**
   * Problem 81 Path sum: two ways
   *
   * In the 5 by 5 matrix below, the minimal path sum from the top left to the bottom right, by only moving to the right and down,
   * is indicated in bold and is equal to 2427.
   *
   * *131* *673* 234 103 018
   * 201 *096* *342* 965 150
   * 630 803 *746* *422* 111
   * 537 699 497 *121* 956
   * 805 732 524 *037* *331*
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
};
