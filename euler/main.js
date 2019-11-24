const fs = require('fs');
const { performance } = require('perf_hooks');
const results = require('./results.json');
const fullResults = require('./fullResults.json');


// select the file based on the CL input, remove suffix (which is sometimes used for testing/trying alternate solutions)
// each file contains 10 solutions
// for example, 1-10 -> 1.js, 11-20 -> 2.js, etc.
const problemID = process.argv[2].replace(/[^\d]+$/g, '');

const eulerCollection = require(`./${Math.ceil(problemID / 10)}`);

global.utils = require('./utils');
global.fs = require('fs');
global.path = require('path');


const start = performance.now();
const result = eulerCollection[`e${process.argv[2]}`].call();
const end = performance.now();
console.log(result);

const time = end - start;
console.log(time);

if (process.argv[3] === '-s' && result !== undefined) {
  const splittedAnswer = result.toString().split('');
  // hide the second half of the answer
  const answer = splittedAnswer.map((x, i) => (i > splittedAnswer.length / 2 - 1 ? '*' : x)).join('');
  results[problemID] = { answer, time: `${time.toFixed(3)}ms` };
  fullResults[problemID] = { answer: result, time: `${time.toFixed(3)}ms` };
  fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
  fs.writeFileSync('fullResults.json', JSON.stringify(fullResults, null, 2));
}
