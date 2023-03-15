
const fs = require('fs');
const path = require('path');
const utils = require('../utils');

module.exports = {
  /**
   * Problem 81 Path sum: two ways
   *
   * In the 5 by 5 matrix below, the minimal path sum from the top left to the bottom right, by only moving to the right and down, is indicated in bold and is equal to 2427.
   *
   * @html <b>131</b> <b>673</b> 234 103 018
   *
   * @html 201 <b>096</b> <b>342</b> 965 150
   *
   * @html 630 803 <b>746</b> <b>422</b> 111
   *
   * @html 537 699 497 <b>121</b> 956
   *
   * @html 805 732 524 <b>037</b> <b>331</b>
   *
   * @question Find the minimal path sum, in [matrix.txt @asset p081_matrix.txt], a text file containing a 80 by 80 matrix, from the top left to the bottom right by only moving right and down.
   * @guide
   * We use a memoized table where the entry [i,j] is the optimal path from 0,0 to i,j.
   * MEM[i, j] = min(MEM[i - 1, j], MEM[i, j - 1]);
   */
  e81() {
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
   * The minimal path sum in the 5 by 5 matrix below, by starting in any cell in the left column and finishing in any cell in the right column, and only moving up, down, and right, is indicated in bold; the sum is equal to 994.
   *
   * @html 131 673 <b>234</b> <b>103</b> <b>018</b>
   *
   * @html <b>201</b> <b>096</b> <b>342</b> 965 150
   *
   * @html 630 803 746 422 111
   *
   * @html 537 699 497 121 956
   *
   * @html 805 732 524 037 331
   *
   * @question Find the minimal path sum, in [matrix.txt @asset p081_matrix.txt], a 31K text file containing a 80 by 80 matrix, from the left column to the right column.
   * @guide
   * We iterate column by column, at each step we memorize the optimal sum from the leftmost column to each element of the current column.
   */
  e82() {
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

  /**
   * Problem 83 Path sum: four ways
   *
   * In the 5 by 5 matrix below, the minimal path sum from the top left to the bottom right, by moving left, right, up, and down, is indicated in bold and is equal to 2297.
   *
   * @html <b>131</b> 673 <b>234</b> <b>103</b> <b>018</b>
   *
   * @html <b>201</b> <b>096</b> <b>342</b> 965 <b>150</b>
   *
   * @html 630 803 746 <b>422</b> <b>111</b>
   *
   * @html 537 699 497 <b>121</b> 956
   *
   * @html 805 732 524 <b>037</b> <b>331</b>
   *
   * @question Find the minimal path sum, in [matrix.txt @asset p081_matrix.txt], a 31K text file containing a 80 by 80 matrix, from the top left to the bottom right by moving left, right, up, and down.
   * @guide
   * We use the dijkstra algorithm to find the shortest path from top left to bottom right
   */
  e83() {
    const raw = fs.readFileSync(path.join(__dirname, './p083_matrix.txt')).toString();
    const MATRIX = raw.split('\n').slice(0, 80).map(row => row.split(',').map(Number));
    const size = MATRIX.length;

    const nodes = [];
    let originalIndex = 0;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        nodes.push({
          row: i,
          col: j,
          dist: Infinity,
          originalIndex: originalIndex++, // node identifier
          value: MATRIX[i][j],
        });
      }
    }

    // init first node
    nodes[0].dist = nodes[0].value;
    // mark the first node
    let markedNodes = [nodes[0]];
    // init the list of unvisited nodes
    let unvisitedNodes = nodes.slice(1);

    // while there are unvisited nodes, find the nearest unvisited node and mark the distances of its neighbors
    while (unvisitedNodes.length) {
      // find next node to visit
      const currentNode = markedNodes.reduce(
        (acc, curr) => (curr.dist < acc.dist ? curr : acc),
        { dist: Infinity },
      );
      // remove this node from the list of unvisited nodes
      unvisitedNodes = unvisitedNodes.filter(unvisited => unvisited.originalIndex !== currentNode.originalIndex);

      // remove this node from the list of marked notes
      markedNodes = markedNodes.filter(marked => marked.originalIndex !== currentNode.originalIndex);

      // mark that node's neighbors
      // top neighbor
      if (currentNode.row > 0) {
        const top = nodes[currentNode.originalIndex - size];
        markNeighbor(top, currentNode);
      }

      // right neighbor
      if (currentNode.col < size - 1) {
        const right = nodes[currentNode.originalIndex + 1];
        markNeighbor(right, currentNode);
      }

      // bottom neighbor
      if (currentNode.row < size - 1) {
        const bottom = nodes[currentNode.originalIndex + size];
        markNeighbor(bottom, currentNode);
      }

      // left neighbor
      if (currentNode.col > 0) {
        const left = nodes[currentNode.originalIndex - 1];
        markNeighbor(left, currentNode);
      }
    }

    return nodes.pop().dist;

    function markNeighbor(neighbor, currentNode) {
      const alreadyMarked = neighbor.dist < Infinity;
      if (currentNode.dist + neighbor.value < neighbor.dist) {
        neighbor.dist = currentNode.dist + neighbor.value;
      }
      if (!alreadyMarked) {
        markedNodes.push(neighbor);
      }
    }
  },

  /**
   * Problem 84 Monopoly Odds
   *
   * In the game, Monopoly, the standard board is set up in the following way:
   *
   * @image p084.png
   *
   * A player starts on the GO square and adds the scores on two 6-sided dice to determine the number of squares they advance in a clockwise direction.
   *
   * Without any further rules we would expect to visit each square with equal probability: 2.5%.
   *
   * However, landing on G2J (Go To Jail), CC (community chest), and CH (chance) changes this distribution.
   *
   * In addition to G2J, and one card from each of CC and CH, that orders the player to go directly to jail, if a player rolls three consecutive doubles, they do not advance the result of their 3rd roll. Instead they proceed directly to jail.
   *
   * At the beginning of the game, the CC and CH cards are shuffled. When a player lands on CC or CH they take a card from the top of the respective pile and, after following the instructions, it is returned to the bottom of the pile. There are sixteen cards in each pile, but for the purpose of this problem we are only concerned with cards that order a movement; any instruction not concerned with movement will be ignored and the player will remain on the CC/CH square.
   *
   * > Community Chest (2/16 cards):
   *
   *   1. Advance to GO
   *
   *   2. Go to Jail
   *
   * > Chance (10/16 cards):
   *
   *   1. Advance to GO
   *
   *   2. Go to JAIL
   *
   *   3. Go to C1
   *
   *   4. Go to E3
   *
   *   5. Go to H2
   *
   *   6. Go to R1
   *
   *   7. Go to next R (railway company)
   *
   *   8. Go to next R
   *
   *   9. Go to next U (utility company)
   *
   *   10. Go back 3 squares.
   *
   * The heart of this problem concerns the likelihood of visiting a particular square. That is, the probability of finishing at that square after a roll. For this reason it should be clear that, with the exception of G2J for which the probability of finishing on it is zero, the CH squares will have the lowest probabilities, as 5/8 request a movement to another square, and it is the final square that the player finishes at on each roll that we are interested in. We shall make no distinction between "Just Visiting" and being sent to JAIL, and we shall also ignore the rule about requiring a double to "get out of jail", assuming that they pay to get out on their next turn.
   *
   * By starting at GO and numbering the squares sequentially from 00 to 39 we can concatenate these two-digit numbers to produce strings that correspond with sets of squares.
   *
   * Statistically it can be shown that the three most popular squares, in order, are JAIL (6.24%) = Square 10, E3 (3.18%) = Square 24, and GO (3.09%) = Square 00. So these three most popular squares can be listed with the six-digit modal string: 102400.
   *
   * @question If, instead of using two 6-sided dice, two 4-sided dice are used, find the six-digit modal string.
   * @guide
   * We just simulate the board game, by rolling the dice 1 million times and see on which squares we land the most.
   */
  e84() {
    const BOARD = [
      'GO', 'A1', 'CC1', 'A2', 'T1', 'R1', 'B1', 'CH1', 'B2', 'B3',
      'JAIL', 'C1', 'U1', 'C2', 'C3', 'R2', 'D1', 'CC2', 'D2', 'D3',
      'FP', 'E1', 'CH2', 'E2', 'E3', 'R3', 'F1', 'F2', 'U2', 'F3',
      'G2J', 'G1', 'G2', 'CC3', 'G3', 'R4', 'CH3', 'H1', 'T2', 'H2',
    ];
    // list of special squares
    const SQUARES = {
      GO: 0,
      JAIL: 10,
      C1: 11,
      E3: 24,
      H2: 39,
      R1: 5,
      R: [5, 15, 25, 35],
      U: [12, 28],
    };
    // community chest cards
    const COMM_CHEST = shuffle([
      () => SQUARES.GO, // advance to GO
      () => SQUARES.JAIL, // go to jail
      ...Array(14),
    ]);
    // chance cards
    const CHANCE = shuffle([
      () => SQUARES.GO, // advance to GO
      () => SQUARES.JAIL, // go to jail
      () => SQUARES.C1, // go to C1
      () => SQUARES.E3, // go to E3
      () => SQUARES.H2, // go to H2
      () => SQUARES.R1, // go to R1
      (square) => (SQUARES.R.find(r => r > square) || SQUARES.R[0]), // go to next R (railroad)
      (square) => (SQUARES.R.find(r => r > square) || SQUARES.R[0]), // id.
      (square) => (SQUARES.U.find(u => u > square) || SQUARES.U[0]), // go to next U (utility)
      (square) => square - 3, // if square <= 2, return  40 + square - 3
      ...Array(6),
    ]);
    // shuffle an array and return the result
    function shuffle(arr = []) {
      const shuffled = [];
      let source = [...arr];
      while (shuffled.length < arr.length) {
        const randomIndex = Math.floor(Math.random() * source.length);
        shuffled.push(source[randomIndex]);
        source = [...source.slice(0, randomIndex), ...source.slice(randomIndex + 1, source.length)];
      }
      return shuffled;
    }

    // initialize a result table
    // {
    //   0: 0,
    //   1: 0,
    //   ...,
    //   39: 0
    // }
    const RESULTS = Object.assign({}, ...[...Array(40)].map((_, i) => ({ [i]: 0 })));
    const DICE_SIDES = 4;
    const SIM_COUNT = 1000000;
    // run simulation
    runSim(SIM_COUNT);
    // format and output result
    const sortedSquares = Object.keys(RESULTS).sort((a, b) => RESULTS[b] - RESULTS[a]).map(x => x.padStart(2, '0'));
    return `${sortedSquares[0]}${sortedSquares[1]}${sortedSquares[2]}`;

    // run simulation for simCount turns, each turn may have multiple rolls due to doubles
    function runSim(simCount) {
      // initial square
      let currentSquare = 0;
      for (let rolls = 0; rolls < simCount; rolls++) {
        let doubles = 0;
        let isDouble = true;
        // keep rolling if we get a double
        while (isDouble) {
          // roll the dices!
          const [r1, r2] = roll(DICE_SIDES);
          // if we rolled a double, incr the count
          if (r1 === r2) {
            doubles++;
            // if it's the third double, exit immediately
            if (doubles === 3) {
              currentSquare = 10;
              RESULTS[10]++;
              break;
            }
          } else {
            // if we didnt roll a double, the loop will not execute again, go to next sim after resolving
            isDouble = false;
          }
          // advance!
          currentSquare = (currentSquare + r1 + r2) % 40;
          // resolve any chance/comm_chest/go_to_jail events
          const [resolvedSquare, stop] = resolveSquare(currentSquare);
          currentSquare = resolvedSquare;
          RESULTS[currentSquare]++;
          if (stop) {
            break;
          }
        }
      }
    }

    // roll 2 dices, return [dice_1_result, dice_2_result]
    function roll(side) {
      return [Math.ceil(Math.random() * side), Math.ceil(Math.random() * side)];
    }

    // resolve any chance/comm_chest/go_to_jail events
    // returns [resolved_square_index, stop?]
    function resolveSquare(square) {
      const squareContent = BOARD[square];
      // go to jail
      if (squareContent === 'G2J' || squareContent === 'JAIL') {
        return [10, true];
      }
      // chance
      if (squareContent.slice(0, 2) === 'CH') {
        // draw a card and move to that square
        const movedTo = resolveCard(square, 'CH');
        // recursively resolve that square
        if (movedTo !== square) {
          return resolveSquare(movedTo);
        }
      }
      // community chest
      if (squareContent.slice(0, 2) === 'CC') {
        // draw a card and move to that square
        const movedTo = resolveCard(square, 'CC');
        // recursively resolve that square
        if (movedTo !== square) {
          return resolveSquare(movedTo);
        }
      }
      // no G2J nor cards, just return the square
      return [square, false];
    }

    // resolve card and return result square
    function resolveCard(square, type) {
      if (type === 'CH') {
        const card = CHANCE.shift();
        CHANCE.push(card);
        if (card) {
          return card(square);
        }
      }
      if (type === 'CC') {
        const card = COMM_CHEST.shift();
        COMM_CHEST.push(card);
        if (card) {
          return card(square);
        }
      }
      return square;
    }
  },

  /**
   * Problem 85 Counting rectangles
   *
   * By counting carefully it can be seen that a rectangular grid measuring 3 by 2 contains eighteen rectangles:
   *
   * @image p085.png
   *
   * @question Although there exists no rectangular grid that contains exactly two million rectangles, find the area of the grid with the nearest solution.
   * @guide
   * To calculate the number of rectangles in an m x n area, we use the formula m(m+1)/2 * n(n+1)/2.
   * This formula is derived by looking at the total number of combinations of selecting, amongst the lattices of the area, a top-left corner C1 and a bottom-left corner C2 that is not on the same row or column as C1.
   * 
   * We iterate over n = 1, 2, ..., at each step we solve for m, where m(m+1)/2 * n(n+1)/2 = 2,000,000.
   * As stated by the problem statement, m cannot be integral, since n is integral, therefore we set M = round(m), and calculate the distance between M(M+1)/2 * n(n+1)/2 and 2,000,000.
   * The pair (n, M) producing the smallest distance above is the winner
   */
  e85() {
    let smallestDist = Infinity;
    let valuesForSmallestDist = [];
    for (let n = 1; n <= 2000; n++) {
      const nTriangle = (n * (n + 1)) / 2;
      // solve nTriangle * m(m+1)/2 = 2,000,000 using quadratic formula
      const m = (Math.sqrt(1 + (16000000 / nTriangle)) - 1) / 2;
      const M = Math.round(m);
      const roundedRectangles = (nTriangle * (M * (M + 1))) / 2;
      const dist = Math.abs(2000000 - roundedRectangles);
      if (dist < smallestDist) {
        smallestDist = dist;
        valuesForSmallestDist = [n, M];
      }
    }
    return valuesForSmallestDist[0] * valuesForSmallestDist[1];
  },

  /**
   * Problem 86 Cuboid Route
   *
   * A spider, S, sits in one corner of a cuboid room, measuring 6 by 5 by 3, and a fly, F, sits in the opposite corner.
   *
   * @image p086.png
   *
   * By travelling on the surfaces of the room the shortest "straight line" distance from S to F is 10 and the path is shown on the diagram.
   *
   * However, there are up to three "shortest" path candidates for any given cuboid and the shortest route doesn't always have integer length.
   *
   * It can be shown that there are exactly 2060 distinct cuboids, ignoring rotations, with integer dimensions, up to a maximum size of M by M by M, for which the shortest route has integer length when M = 100.
   *
   * This is the least value of M for which the number of solutions first exceeds two thousand; the number of solutions when M = 99 is 1975.
   *
   * @question Find the least value of M such that the number of solutions first exceeds one million.
   * @guide
   * Explained in the code comments
   */
  e86() {
    // We will break down the solution of this problem into different parts:

    // PART 1: FINDING THE MINIMAL DISTANCE BETWEEN TWO POINTS IN A CUBOID
    // For any cuboid with given lengths (X,Y,Z)
    // (!) The three candidates for the shortest paths are: √(X²+(Y+Z)²), √(Y²+(X+Z)²), √(Z²+(X+Y)²)
    // This can be seen by unfolding the cuboid, and traversing the 3 adjacent surfaces from the starting point.
    // (!) The shortest path among the 3 is the one where the largest side is the 'isolated' square in the root
    // eg. if we have side lengths (6, 5, 3)
    // the winning candidate will be √(6² + (5 + 3)²), since 6 is the largest side, and is also the 'isolated' number
    // otoh, consider the candidate √(5² + (6 + 3)²): here 5 is the isolated number, and thus cannot be the shortest path
    // this is because we want to minimize the difference between the base of the 2 squares inside the root
    // in our case, dist(6, 8) < dist (5, 9), therefore 6² + 8² < 5² + 9²

    // PART 2: FINDING/GENERATING CUBOIDS WITH INTEGRAL SOLUTIONS
    // WLOG, assume that the minimal path for a cuboid is √(X²+(Y+Z)²)
    // (!) The minimal path is integral if and only if X and Y+Z are the 2 smallest numbers in a Pythagorean triplet
    // Using this, we can generate cuboid with integral shortest path from Pythagorean triplets
    // (!) Given a triplet A,B,C; we take A and B, and break B down into the sum of 2 integers
    // eg. Given 6,8,10; we have (6,8) => (6,6,2), (6,5,3), (6,4,4)
    // we skip (6,7,1) since 6 is not the largest side because (7,6,1) will have a shorter path

    // PART 3: INCREMENTAL GENERATION OF CUBOID SOLUTIONS
    // Given any M, we need to find the list of solutions which make a Pythagorean triple with M as one of the 2 legs
    // eg. M = 6, we have 6, 8, 10 as a triplet, the number of cuboids possible with 6 as the longest side is 3
    // eg. M = 8, we have 8, 6, 10 as a triplet, the number of cuboids with 8 as the longest side is 6 / 2 = 3
    // Obs: Let a, b be the legs of a right triangle, and a < b, then we have the following:
    // (!) 1. If M = a, then # solutions = a - ceil(b / 2) + 1
    // (!) 2. If M = b, then # solutions = floor(a / 2)
    // For each M, we need to search from 2 to 2*M, since the smallest cuboid is (M, 1, 1) and the largest is (M, M, M)

    let answer = 0;
    let solutions = 0;
    let M = 1;
    while (!answer) {
      // M > n
      for (let n = 2; n < M; n++) {
        if (Number.isInteger(Math.sqrt((M ** 2) + (n ** 2)))) {
          solutions += Math.floor(n / 2);
        }
      }
      // M < n
      for (let n = M; n < 2 * M; n++) {
        if (Number.isInteger(Math.sqrt((M ** 2) + (n ** 2)))) {
          solutions += (M - Math.ceil(n / 2)) + 1;
        }
      }
      if (solutions > 1000000) {
        answer = M;
        return answer;
      }
      M++;
    }
  },
};
