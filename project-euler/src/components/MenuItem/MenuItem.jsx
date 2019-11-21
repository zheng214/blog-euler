/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import cn from 'classnames';
import './style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: !props.expanded,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.expanded !== this.props.expanded) {
      this.setState(({ collapsed }) => ({
        collapsed: collapsed && !this.props.expanded,
      }));
    }
  }

  render() {
    const { expandable } = this.props;
    return (
      <div className="e-menu">
        <button
          type="button"
          onClick={() => this.setState((prev) => ({ collapsed: !prev.collapsed }))}
        >
          <span>{this.props.label}</span>
          <span>{expandable && <FontAwesomeIcon icon={this.state.collapsed ? faAngleDown : faAngleUp} />}</span>
        </button>
        <div className={`e-menu__nested ${this.state.collapsed ? 'collapsed' : 'expanded'}`}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export function Item(props) {
  return (
    <div className="e-item">
      <button
        type="button"
        onClick={() => props.history.push({ pathname: props.destination, origin: null })}
      >
        <span className={cn({ highlighted: props.highlighted })}>
          {props.id && `${props.id}. `}
          {props.label}
        </span>
      </button>
    </div>
  );
}
