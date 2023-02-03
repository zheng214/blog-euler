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


const resolve = (rp) => path.resolve(__filename, rp);

const TITLE_REGEX = /^.+\* Problem (\d{1,2}):?\s?/;
const QUESTION_REGEX = /@question/;
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
      input: fs.createReadStream(`${readPath}/${file}/index.js`),
    });
    let problemData = {};
    let problemDescription = [];
    let questionDescription = [];
    let solutionDescription = [];
    let utils = {};
    let bracketBalance = 0;
    let readState = '';
    lineStreamer.on('line', (line) => {
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
          if (!SOLUTION_REGEX.test(line)) {
            questionDescription.push(line.split(/@question\s?/)[1]);
            return null;
          }
          readState = 'solution';
          bracketBalance = 1;
          return null;
        case 'solution': {
          const uncommented = line.split('//')[0];
          const utilRegex = /utils\.(\w+)/g;
          let utilMatch = utilRegex.exec(uncommented);
          while (utilMatch) {
            const utilFunction = utilMatch[1];
            utils[`${dependencies[utilFunction]}/${utilFunction}`] = true;
            utilsUsage[utilMatch[1]] = utilsUsage[utilMatch[1]] || {};
            utilsUsage[utilMatch[1]][problemData.id] = true;
            utilMatch = utilRegex.exec(uncommented);
          }
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
        solution: solutionDescription.filter(Boolean).map(x => x.substring(4, x.length)).join('\n'),
        utils: Object.keys(utils),
      };
      data.push(problemData);
      problemData = {};
      problemDescription = [];
      questionDescription = [];
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
