/* eslint-disable no-fallthrough */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
const data = [];
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const lineReader = require('readline');
const { readPath, writePath } = require('./paths');

const UTILS = require(`${readPath}/utils/namedExports`);
const dependencies = {};

Object.keys(UTILS).forEach((file) => {
  const methods = Object.keys(UTILS[file]);
  methods.forEach(method => {
    dependencies[method] = file;
  });
});

// console.log(dependencies)
// {
//   isOdd: 'arithmetic',
//   isEven: 'arithmetic',
//   listPrimeFactors: 'arithmetic',  
//   gcd: 'arithmetic',
//   isCoprime: 'arithmetic',
//   listProperDivisors: 'arithmetic',
//   computeSumOfDivisors: 'arithmetic',
//   reduceLCT: 'arithmetic',
//   generateTriangulars: 'arithmetic',
//   toPolygonal: 'arithmetic',
//   isTriangular: 'arithmetic',
//   isPentagonal: 'arithmetic',
//   fact: 'combinatorics',
//   generateFactTable: 'combinatorics',
//   convertToFactorialBase: 'combinatorics',
//   getLexicalPermutation: 'combinatorics',
//   choose: 'combinatorics',
//   listOrderedCombinations: 'combinatorics',
//   sumArray: 'common',
//   contains: 'common',
//   insertElementSorted: 'common',
//   initTable: 'common',
//   containsDuplicate: 'lang',
//   toArray: 'lang',
//   flip: 'lang',
//   isPalindrome: 'lang',
//   haveSameDigits: 'lang',
//   isPrime: 'primes',
//   generatePrimesTable: 'primes'
// }

const resolve = (rp) => path.resolve(__dirname, rp);

const TITLE_REGEX = /^.+\* Problem (\d{1,2}):?\s?/;
const QUESTION_REGEX = /@question/;
const GUIDE_REGEX = /@guide/;
const SOLUTION_REGEX = /e\d{1,2}\s?\(\)/;
const utilsUsage = {};

fs.readdir(resolve(readPath), async (err, files) => {
  await Promise.each(files, async file => generateSiteData(file));
  generateUtils();
  fs.writeFileSync(resolve(`${writePath}/solutions.json`), JSON.stringify(data, null, 2));
});

function generateSiteData(file) {
  return new Promise(done => {
    if (!/\d{1,2}/.test(file)) {
      done();
      return null;
    }
    const lineStreamer = lineReader.createInterface({
      input: fs.createReadStream(`${resolve(readPath)}/1/index.js`),
    });
    let problemData = {};
    let problemDescription = [];
    let questionDescription = [];
    let guideDescription = [];
    let solutionDescription = [];
    let utils = {};
    let bracketBalance = 0;
    let readState = '';
    lineStreamer.on('line', (line) => {
      // in this scope, return null means go next line
      if (TITLE_REGEX.test(line)) {
        const [_, id, title] = line.split(TITLE_REGEX);
        Object.assign(problemData, { id, title });
        readState = 'description';
        return null; 
      }

      switch (readState) {
        case 'description': {
          if (!QUESTION_REGEX.test(line)) {
            problemDescription.push(line.split(/^[^*]+\*\s/)[1]);
            return null;
          }
          readState = 'question';
        }
        case 'question':
          if (QUESTION_REGEX.test(line)) {
            questionDescription.push(line.split(/@question\s?/)[1]);;
          } else if (SOLUTION_REGEX.test(line)) {
            readState = 'solution';
            bracketBalance = 1;
          } else if (GUIDE_REGEX.test(line)) {
            readState = 'guide';
          }
          return null;
        case 'guide': {
          if (SOLUTION_REGEX.test(line)) {
            readState = 'solution';
            bracketBalance = 1;
          } else if (line.includes('*/')) {
            return null;
          } else {
            guideDescription.push(line.substring(5, line.length));
          }
          return null;
        }
        case 'solution': {
          const uncommented = line.split('//')[0];
          const utilRegex = /utils\.(\w+)/g;
          let utilMatch = utilRegex.exec(uncommented);
          while (utilMatch) {
            const utilFunction = utilMatch[1];
            utils[`${dependencies[utilFunction]}/${utilFunction}`] = true;
            if (!utilsUsage[utilFunction]) {
              utilsUsage[utilFunction] = {};
            }
            utilsUsage[utilFunction][problemData.id] = true;
            utilMatch = utilRegex.exec(uncommented);
          }
          // console.log(utilsUsage)
          // {
          // computeSumOfDivisors: { '21': true, '23': true },
          // convertToFactorialBase: { '24': true },
          // reduceLCT: { '33': true },
          // generateFactTable: { '34': true },
          // isEven: { '39': true, '53': true, '75': true, '77': true },
          // isCoprime: { '39': true },
          // getLexicalPermutation: { '41': true, '54': true, '68': true },
          // generateTriangulars: { '42': true },
          // containsDuplicate: { '43': true },
          // isPentagonal: { '44': true, '45': true },
          // isTriangular: { '45': true },
          // listOrderedCombinations: { '51': true },
          // flip: { '55': true },
          // isPalindrome: { '55': true },
          // haveSameDigits: { '70': true },
          // gcd: { '73': true, '75': true },
          // initTable: { '81': true }
          // }
          const leftBrackets = (uncommented.match(/\{/g) || []).length;
          const rightBrackets = (uncommented.match(/\}/g) || []).length;
          bracketBalance += leftBrackets - rightBrackets;
          if (bracketBalance === 0) {
            break;
          }
          solutionDescription.push(line);
          return null;
        }
        default:
          return null;
      }
      // end of solution:
      problemData = {
        ...problemData,
        description: problemDescription,
        question: questionDescription,
        guide: guideDescription,
        solution: solutionDescription.filter(Boolean).map(x => x.substring(4, x.length)).join('\n'), // 4 whitespace
        utils: Object.keys(utils),
      };
      data.push(problemData);
      problemData = {};
      problemDescription = [];
      questionDescription = [];
      guideDescription = [];
      solutionDescription = [];
      utils = {};
      readState = '';
      return null;
    });
    lineStreamer.on('close', () => {
      done();
    });
  });
}

function generateUtils() {
  const utilsData = {};
  fs.readdir(resolve(`${readPath}/utils`), async (err, files) => {
    await Promise.each(files, async (file) => generateUtilDescription(file));
    fs.writeFileSync(resolve(`${writePath}/utils.json`), JSON.stringify(utilsData, null, 2));
  });
  function generateUtilDescription(file) {
    return new Promise(done => {
      const lineStreamer = lineReader.createInterface({
        input: fs.createReadStream(resolve(`${readPath}/utils/${file}`)),
      });
      if (file === 'index.js' || file === 'namedExports.js') {
        return done();
      }
      file = file.split('.')[0];
      utilsData[file] = {};
      const fileDescription = utilsData[file];
      let description = {};
      let inFunction = false;
      let bracketBalance = 0;
      let fname = '';
      lineStreamer.on('line', (line) => {
        if (/\* @overview/.test(line)) {
          fileDescription.description = line.split('@overview')[1].trim();
        }
        if (/\* @function/.test(line)) {
          fname = line.split('@function')[1].trim();
          fileDescription[fname] = {};
          description = fileDescription[fname];
          return null;
        }
        if (/\* @description/.test(line)) {
          const _description = line.split('@description')[1].trim();
          description.description = description.description ? [...description.description, _description] : [_description];
          return null;
        }
        if (/\* @param/.test(line)) {
          const _param = line.split('@param')[1].trim();
          const [paramType, paramVar, ...paramDescription] = _param.split(' ');
          const param = {
            type: paramType, var: paramVar, description: paramDescription.join(' '),
          };
          description.params = description.params ? [...description.params, param] : [param];
          return null;
        }
        if (/\* @returns/.test(line)) {
          const _return = line.split('@returns')[1].trim();
          const [returnType, ...returnDescription] = _return.split(' ');
          const returns = {
            type: returnType, description: returnDescription.join(' '),
          };
          description.returns = returns;
          return null;
        }
        if (/\* @example/.test(line)) {
          const _example = line.split('@example')[1].trim();
          const [inputString, outputString] = _example.split(';');
          const input = inputString.split('input: ')[1]
          const output = outputString.split('output: ')[1]
          const example = { input, output };
          description.examples = description.examples ? [...description.examples, example] : [example];
          return null;
        }
        if (/\* @see/.test(line)) {
          const related = line.split('@see')[1].trim();
          description.related = related;
          return null;
        }
        if (/^function (\w)+\(.+\) \{/.test(line)) {
          inFunction = true;
          description.func = [];
        }
        if (inFunction) {
          description.func.push(line);
          const leftBrackets = (line.split('//')[0].match(/\{/g) || []).length;
          const rightBrackets = (line.split('//')[0].match(/\}/g) || []).length;
          bracketBalance += leftBrackets - rightBrackets;
          if (bracketBalance === 0) {
            description.func = description.func.join('\n');
            description.related = Object.keys(utilsUsage[description.name] || {}) || [];
            fileDescription[fname] = { ...description };
            fname = '';
            description = null;
            inFunction = false;
            bracketBalance = 0;
          }
        }
        return null;
      });
      lineStreamer.on('close', () => {
        utilsData[file] = { ...fileDescription };
        done();
      });
    });
  }
}
