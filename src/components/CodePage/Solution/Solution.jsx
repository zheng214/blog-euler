import React from 'react';
import cn from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faExpand,
} from '@fortawesome/free-solid-svg-icons';

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';

import {
  hybrid, atomOneLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { BlockMath } from 'react-katex';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'katex/dist/katex.min.css';

import SOLUTIONS from '../../../data/solutions.json';
import UTILS from '../../../data/utils.json';
import ANSWERS from '../../../data/fullResults.json';

import Tooltip from '../../Tooltip/Tooltip';
import Modal from '../Modal/Modal';

const ASSETS = require.context('../../../assets', false, /\.(png|txt)$/);

SyntaxHighlighter.registerLanguage('javascript', js);

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

export default class Solution extends React.Component {
  static formatAsset(line) {
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

  static formatGuide(line) {
    return (
      <span
        dangerouslySetInnerHTML={{ __html: line }}
      />
    );
  }

  static formatDescription(line, index) {
    if (line) {
      if (line.includes('@math')) {
        return <BlockMath math={line.split('@math ')[1]} />;
      }

      if (line.includes('@html')) {
        return (
          <span
            className={cn({ mono: line.charAt(0) === ' ' })}
            dangerouslySetInnerHTML={{ __html: line.split('@html')[1] }}
          />
        );
      }

      if (line.includes('@image')) {
        const imgLink = line.split('@image')[1].trim();
        return <img className="asset-image" src={ASSETS(`./${imgLink}`)} alt="asset" />;
      }

      if (line.includes('@asset')) {
        return Solution.formatAsset(line);
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

  static formatQuestion(line) {
    if (line) {
      if (line.includes('@asset')) {
        return Solution.formatAsset(line);
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

  static formatHelpers(utilLink, props) {
    console.log({ utilLink, props })
    const [file, method] = utilLink.split('/');
    console.log({ UTILS, file })
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

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
    };
  }

  render() {
    const { solutionId, darkMode } = this.props;
    if (!solutionId && solutionId !== 0) {
      return null;
    }

    const solutionData = SOLUTIONS[+solutionId - 1];
    const tooltipMessage = (
      <span>
        The answer is the value returned by the top-most level&nbsp;
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
            <p>{solutionData.description.map(Solution.formatDescription)}</p>
          </div>
          <div className="description__question">
            <p>
              <span style={{ fontWeight: 'bold' }}>Question: </span>
              <span>{solutionData.question.map(Solution.formatQuestion)}</span>
            </p>
          </div>
        </div>
        {solutionData.guide.length ? (
          <div className="description">
            <div className="description__title">
              <h4>Guide</h4>
            </div>
            <div className="description__description">
              <p>{solutionData.guide.map(Solution.formatGuide)}</p>
            </div>
          </div>
        ) : null}
        <div className="container">
          <div className="container__header">
            <div className="left" />
            <div className="center">
              <h4>Solution</h4>
              <div className="container__header-info">
                <Tooltip message={tooltipMessage} icon={faInfoCircle} />
              </div>
            </div>
            <div className="right">
              <Tooltip message={<span>Expand</span>} icon={faExpand} onClick={() => this.setState({ modalOpen: true })} />
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
              {solutionData.utils.map((utilLink) => Solution.formatHelpers(utilLink, this.props))}
            </dl>
          </div>
        ) : null}
        <Modal
          open={this.state.modalOpen}
          onClose={() => this.setState({ modalOpen: false })}
          content={renderCode(solutionData.solution, darkMode)}
        />
      </div>
    );
  }
}
