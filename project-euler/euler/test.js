const fs = require('fs');
const fullResults = require('./fullResults.json');

global.utils = require('./utils');
global.fs = require('fs');
global.path = require('path');

const failures = [];

const solutionFolders = fs.readdirSync(__dirname).filter(file => /\d{1,2}/.test(file));

solutionFolders.forEach(folder => {
  const solutions = require(`./${folder}`);
  Object.keys(solutions).forEach(func => {
    const result = solutions[func].call();
    const id = func.split('e')[1];
    const { answer } = fullResults[id];
    console.log('testing ', id)
    if (result !== answer) {
      console.log(`FAILED => EXPECTED: ${answer} GOT: ${result}`);
      failures.push(`FAILED => EXPECTED: ${answer} GOT: ${result}`);
    } else {
      console.log(id, ' OK')
    }
  });
});

console.log('testing completed');
failures.forEach(failure => console.log(failure));

process.exit(0);
