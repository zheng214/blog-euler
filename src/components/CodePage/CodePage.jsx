import React from 'react';

import Solution from './Solution/Solution';
import Utility from './Utility/Utility';
import Navigation from './Navigation/Navigation';

import './style.scss';

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
