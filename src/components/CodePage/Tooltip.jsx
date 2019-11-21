import React from 'react';
import cn from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './tooltip.scss';

export default class Tooltip extends React.Component {
  state = {
    hovered: false,
  }

  render() {
    return (
      <div className="tooltip-container">
        <div
          className="tooltip-icon"
          onMouseEnter={() => this.setState({ hovered: true })}
          onMouseLeave={() => this.setState({ hovered: false })}
        >
          <FontAwesomeIcon icon={this.props.icon}></FontAwesomeIcon>
          <div className={cn('tooltip-message', { hovered: this.state.hovered })}>
            {this.props.message}
          </div>
        </div>
      </div>
    );
  }
}
