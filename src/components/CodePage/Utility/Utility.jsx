import React from 'react';
import { connect } from 'react-redux';

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';

import {
  hybrid, atomOneLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faExpand,
} from '@fortawesome/free-solid-svg-icons';

import UTILS from '../../../data/utils.json';

import Modal from '../Modal/Modal';

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

class Utility extends React.Component {
  static formatUtilityDescription(utilityData, darkMode) {
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

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
    };
  }

  render() {
    const {
      filename, utility, darkMode, history,
    } = this.props;
    if (!filename || !utility) {
      return null;
    }
    const utilityData = UTILS[filename][utility];

    return (
      <div className="page__solution">
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
            {Utility.formatUtilityDescription(utilityData, darkMode)}
          </div>
        </div>
        <div className="container">
          <div className="container__header">
            <FontAwesomeIcon icon={faExpand} onClick={() => this.setState({ modalOpen: true })} />
          </div>
          {renderCode(utilityData.func, darkMode)}
        </div>
        <Modal
          open={this.state.modalOpen}
          onClose={() => this.setState({ modalOpen: false })}
          content={renderCode(utilityData.func, darkMode)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    darkMode: state.darkMode,
  }
}

export default connect(mapStateToProps)(Utility);
