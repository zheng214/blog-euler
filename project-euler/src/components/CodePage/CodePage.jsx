/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faAngleRight,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';

import {
  hybrid, atomOneLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs';

import * as themes from 'react-syntax-highlighter/dist/esm/styles/hljs';

import cn from 'classnames';

import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

import Tooltip from './Tooltip';

import SOLUTIONS from '../../data/solutions.json';
import UTILS from '../../data/utils.json';
import ANSWERS from '../../data/fullResults.json';

import './style.scss';

const ASSETS = require.context('../../assets', false, /\.(png|txt)$/);

SyntaxHighlighter.registerLanguage('javascript', js);
const SOLVED = SOLUTIONS.length;

function test(samples = themes, content) {
  const codeString = `
  function insertElementSorted(arr, element, insertLeft = (e, a) => e < a) {
    const arrLen = arr.length;
    if (arrLen === 0) {
      return [element];
    }
    if (arrLen === 1) {
      return insertLeft(element, arr[0]) ? [element, ...arr] : [...arr, element];
    }
    const middleIndex = Math.floor((arrLen) / 2);
    const left = arr.slice(0, middleIndex);
    const right = arr.slice(middleIndex, arrLen);
    if (insertLeft(element, arr[middleIndex])) {
      return [...insertElementSorted(left, element), ...right];
    }
    return [...left, ...insertElementSorted(right, element)];
  }
  `;
  return Object.keys(samples).map((theme) => {
    const t = themes[theme];
    return (
      <div className="App">
        <h4>{theme}</h4>
        <SyntaxHighlighter
          language="javascript"
          style={t}
        >
          {content || codeString}
        </SyntaxHighlighter>
      </div>
    );
  });
}

function renderCode(content, darkMode) {
  return (
    <SyntaxHighlighter
      language="javascript"
      style={darkMode ? hybrid : atomOneLight}
      customStyle={{ transition: 'background-color 0.3s' }}
    >
      {content}
    </SyntaxHighlighter>
  );
}

function formatAsset(line) {
  const [before, assetInfo, after] = line.split(/\[([^[]+ @asset [^\]]+)\]/);
  const [assetName, assetPath] = assetInfo.split('@asset');
  const filePath = assetPath.trim().replace(/'/g, '');
  return (
    <>
      <span>{before}</span>
      <a href={ASSETS(`./${filePath}`)} target="_blank" rel="noopener noreferrer">{assetName}</a>
      <span>{after}</span>
    </>
  );
}

function formatDescription(line, index) {
  if (line) {
    if (line.includes('@math')) {
      return <BlockMath math={line.split('@math ')[1]} />;
    }

    if (line.includes('@html')) {
      return <span className={cn({ mono: line.charAt(0) === ' ' })} dangerouslySetInnerHTML={{ __html: line.split('@html')[1] }} />;
    }

    if (line.includes('@image')) {
      const imgLink = line.split('@image')[1].trim();
      return <img className="asset-image" src={ASSETS(`./${imgLink}`)} alt="asset" />;
    }

    if (line.includes('@asset')) {
      return formatAsset(line);
    }
    return (
      <span className={cn({ mono: line.charAt(0) === ' ' })}>
        {line}
      </span>
    );
  }
  if (index > 0) {
    return (
      <>
        <br />
        <br />
      </>
    );
  }
  return null;
}

function formatQuestion(line) {
  if (line) {
    if (line.includes('@asset')) {
      return formatAsset(line);
    }
    return line;
  }
  return (
    <>
      <br />
      <br />
    </>
  );
}

function formatHelpers(utilLink, props) {
  const [file, method] = utilLink.split('/');
  const utilInfo = UTILS[file][method];
  return (
    <>
      <dt>
        <a
          role="button"
          onClick={() => {
            props.history.push({ pathname: `/u/${utilLink}`, origin: props.location.pathname, yPos: window.scrollY });
          }}
        >
          <span className="inline-code-highlight">{method}</span>
        </a>
      </dt>
      <dd><span>{`${utilInfo.description}`}</span></dd>
    </>
  );
}

function formatUtilityDescription(utilityData, darkMode) {
  const {
    description,
    params,
    returns,
    examples = [],
  } = utilityData;
  return (
    <>
      <dl className="utility-dl">
        <dt>Description</dt>
        <dd>{description.join(' ')}</dd>
        <dt>Parameters</dt>
        <dd>
          {params.map(({ type: paramType, var: paramVar, description: paramDescription }) => (
            <>
              <span className="inline-code-highlight">{paramType}</span>
              &nbsp;
              <span className="inline-code-highlight">{paramVar}</span>
              &nbsp;
              <span>{`: ${paramDescription}`}</span>
              <br />
            </>
          ))}
        </dd>
        <dt>Returns</dt>
        <dd>
          <span className="inline-code-highlight">{returns.type}</span>
          &nbsp;
          {returns.description && <span>{`: ${returns.description}`}</span>}
        </dd>
      </dl>
      {!examples.length ? null : (
        <>
          <p>Example</p>
          {examples.map(({ input, output }) => renderCode([`Input: ${input}`, `Output: ${output}`].join('\n'), darkMode))}
        </>
      )}
    </>
  );
}

export default class CodePage extends React.Component {
  renderContent() {
    const {
      darkMode, location, history, match, solutionId, filename, utility,
    } = this.props;
    if (solutionId) {
      return (
        <>
          <Navigation solutionId={solutionId} history={history} />
          <Solution solutionId={solutionId} history={history} darkMode={darkMode} location={location} />
        </>
      );
    }
    if (filename && utility) {
      return (
        <Utility
          filename={filename}
          utility={utility}
          history={history}
          match={match}
          darkMode={darkMode}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <div className="page">
        {this.renderContent()}
      </div>
    );
  }
}

function Navigation(props) {
  const { solutionId } = props;
  if (!solutionId) {
    return null;
  }

  const isFirst = solutionId === 1;
  const isLast = solutionId === SOLVED - 1;

  const rewind = () => props.history.push(`${+solutionId - 1}`);
  const random = () => props.history.push(`${Math.ceil(SOLVED * Math.random())}`);
  const forward = () => props.history.push(`${+solutionId + 1}`);

  return (
    <div className="page__navigation">
      <button className={cn({ disabled: isFirst })} onClick={rewind} type="button">
        <span><FontAwesomeIcon icon={faAngleLeft} /></span>
      </button>
      <button onClick={random} type="button">
        <span>Random</span>
      </button>
      <button className={cn({ disabled: isLast })} onClick={forward} type="button">
        <span><FontAwesomeIcon icon={faAngleRight} /></span>
      </button>
    </div>
  );
}

function Solution(props) {
  const { solutionId, darkMode } = props;
  if (!solutionId && solutionId !== 0) {
    return null;
  }

  const solutionData = SOLUTIONS[+solutionId - 1];
  const tooltipMessage = (
    <span>
      The answer is the value returned by the top level&nbsp;
      <code>return</code>
    </span>
  );
  return (
    <div className="page__solution">
      <div className="description">
        <div className="description__title">
          <h3>{`${solutionData.id}. ${solutionData.title}`}</h3>
        </div>
        <div className="description__description">
          <p>{solutionData.description.map(formatDescription)}</p>
        </div>
        <div className="description__question">
          <p>
            <span style={{ fontWeight: 'bold' }}>Question: </span>
            <span>{solutionData.question.map(formatQuestion)}</span>
          </p>
        </div>
      </div>
      <div className="container">
        <div className="container__header">
          <h4>Solution</h4>
          <div className="container__header-info">
            <Tooltip message={tooltipMessage} icon={faInfoCircle} />
          </div>
        </div>
        {renderCode(solutionData.solution, darkMode)}
      </div>
      <div className="results">
        <div className="results__header">
          <h4>Results</h4>
          <div className="results__header-info">
            <Tooltip
              message={<span>Time is measured on a stock (non-overclocked) Intel i7-9700k processor</span>}
              icon={faInfoCircle}
            />
          </div>
        </div>
        {renderCode(`Result: ${ANSWERS[solutionId].answer}\nTime: ${ANSWERS[solutionId].time}`, darkMode)}
      </div>
      {solutionData.utils.length ? (
        <div className="helpers">
          <h4>Helper functions</h4>
          <dl>
            {solutionData.utils.map((utilLink) => formatHelpers(utilLink, props))}
          </dl>
        </div>
      ) : null}
    </div>
  );
}

function Utility(props) {
  const { filename, utility, darkMode, history } = props;
  if (!filename || !utility) {
    return null;
  }
  const utilityData = UTILS[filename][utility];

  return (
    <div className="page__utility">
      {!((history || {}).location || {}).origin ? null : (
        <button
          className="go-back"
          type="button"
          onClick={() => history.push({ pathname: history.location.origin, scrollTo: history.location.yPos })}
        >
          <span>Back</span>
        </button>
      )}
      <div className="description">
        <div className="description__title">
          <h3>{utility}</h3>
        </div>
        <div className="description__description">
          {formatUtilityDescription(utilityData, darkMode)}
        </div>
      </div>
      <div className="container">
        {renderCode(utilityData.func, darkMode)}
      </div>
    </div>
  );
}
