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
   * @question Find the minimal path sum, in [matrix.txt](https://github.com/zheng214/euler/blob/master/euler/9/p081_matrix.txt),
   * @question a text file containing a 80 by 80 matrix, from the top left to the bottom right by only moving right and down.
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
   * @question Find the minimal path sum, in [matrix.txt](https://github.com/zheng214/euler/blob/master/euler/9/p082_matrix.txt),
   * @question a 31K text file containing a 80 by 80 matrix, from the left column to the right column.
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

  /**
   * Problem 83 Path sum: four ways
   *
   * In the 5 by 5 matrix below, the minimal path sum from the top left to the bottom right, by moving left, right, up, and down,
   * is indicated in bold and is equal to 2297.
   *
   * **131** 673 **234** **103** **018**
   * **201** **096** **342** 965 **150**
   * 630 803 746 **422** **111**
   * 537 699 497 **121** 956
   * 805 732 524 **037** **331**
   *
   * @question Find the minimal path sum, in [matrix.txt](https://github.com/zheng214/euler/blob/master/euler/9/p083_matrix.txt),
   * @question a 31K text file containing a 80 by 80 matrix, from the top left to the bottom right by moving left, right, up, and down.
   */
  e83() {
    const raw = fs.readFileSync(path.join(__dirname, './p083_matrix.txt')).toString();
    const MATRIX = raw.split('\n').slice(0, 80).map(row => row.split(',').map(Number));
    const size = MATRIX.length;
  
    // we use the dijkstra algorithm to find the shortest path from top left to bottom right
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
   * [tldr;](https://projecteuler.net/problem=84) Find the most frequently visited square on a monopoly board
   *
   * @question Find the 3 most frequently visited square on a monopoly board using two 4-sided dices
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
    return `${sortedSquares[0]}${sortedSquares[1]}${sortedSquares[2]}`

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
   * By counting carefully it can be seen that a rectangular grid measuring 3 by 2 contains [eighteen rectangles](https://projecteuler.net/problem=85):
   * 
   * @question Although there exists no rectangular grid that contains exactly two million rectangles, find the area of the grid with the nearest solution.
   */
  e85() {
    // to calculate the number of rectangles in an m x n area
    // we use the formula m(m+1)/2 * n(n+1)/2
    // this formula is derived by looking at the total number of combinations of selecting, amongst the lattices of the area,
    // a top-left corner C1 and a bottom-left corner C2 that is not on the same row or column as C1

    // we iterate over n = 1, 2, ...
    // at each step we solve for m, where m(m+1)/2 * n(n+1)/2 = 2,000,000
    // at stated by the problem statement, m cannot be integral, since n is integral
    // therefore we set M = round(m), and calculate the distance between M(M+1)/2 * n(n+1)/2 and 2,000,000
    // the pair (n, M) producing the smallest distance above is the winner

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
};
