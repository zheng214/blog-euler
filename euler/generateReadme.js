// generates a glossary of solved problems

const fs = require('fs');
const lineReader = require('readline');
const Promise = require('bluebird');

const stream = fs.createWriteStream('README.md');

stream.once('open', async (fd) => {
  stream.write('## <p align="center"> Project Euler Menu </p>');
  stream.write('\n\n');
  stream.write('Click on the "Solution" to go to the code solution');
  stream.write('\n\n');
  stream.write('Click on the problem name to go to the problem statement on the Project Euler website');
  stream.write('\n\n');
  stream.write('The answers and time of execution can be found in `results.json` ');
  stream.write('(answers are partially blurred with respect to Project Euler\'s proper etiquette)');
  stream.write('\n\n<br/><br/>\n\n');
  stream.write('## <p align="center"> Solutions </p>');
  stream.write('\n');
  await generateMenu();
  stream.write('\n\n');
  stream.write('<a href="#">Go to top</a>');
  stream.end();
});

function generateMenu() {
  return new Promise((resolve) => {
    fs.readdir('.', async (err, files) => {
      await Promise.each(files, async file => generateFileMenu(file));
      resolve();
    });
  });
}

function generateFileMenu(file) {
  // find directories with name "1, 2, 3, ..., 99";
  if (/\d{1,2}/.test(file) && fs.lstatSync(file).isDirectory()) {
    const lineStreamer = lineReader.createInterface({
      input: fs.createReadStream(`${file}/index.js`),
    });

    let currentLine = 1;

    // memorized line number and content of a problem
    let startLine;
    let problemID;
    let problemName;
    let questionCapture = ''; // can be multiline

    // tracks the difference of "{" and "}" inside a solution. bracketBalance === 0 marks the end of the solution
    let bracketBalance;
    let isInSolution = false;
    lineStreamer.on('line', async (line) => {
      // matches the start of problem description
      const problemStartMatch = line.match(/Problem (\d{1,3})[^\w]*(\w.+)$/);
      if (problemStartMatch) {
        [, problemID, problemName] = problemStartMatch;
        startLine = currentLine - 1;
      }

      // matches the question statement
      const questionMatch = line.match(/@question (.+)$/);
      if (questionMatch) {
        questionCapture += `  ${questionMatch[1]}\n`;
      }

      // matches the start of the solution
      const functionMatch = line.match(/e\d{1,3}\(\) \{/);
      if (functionMatch) {
        bracketBalance = 0;
        isInSolution = true;
      }

      if (isInSolution) {
        const leftBrackets = (line.split('//')[0].match(/\{/) || []).length;
        const rightBrackets = (line.split('//')[0].match(/\}/) || []).length;
        bracketBalance = bracketBalance + leftBrackets - rightBrackets;
        if (bracketBalance === 0) { // end of problem, write all content of problem
          const githubURLTemplate = 'https://github.com/zheng214/euler/blob/master/euler/{folder}/index.js#L{start}-L{end}';
          const githubURL = githubURLTemplate
            .replace('{folder}', file)
            .replace('{start}', startLine)
            .replace('{end}', currentLine);

          const eulerURLTemplate = 'https://projecteuler.net/problem={problem}';
          const eulerURL = eulerURLTemplate
            .replace('{problem}', problemID);

          stream.write(`**Problem ${problemID}** [ [Solution](${githubURL}) | [${problemName} :arrow_upper_right:](${eulerURL}) ]: \n`);
          stream.write(questionCapture);
          stream.write('<br/><br/>\n');

          isInSolution = false;
          questionCapture = '';
        }
      }
      currentLine++;
    });
    lineStreamer.on('close', async () => {
      return Promise.resolve();
    });
  }
}
