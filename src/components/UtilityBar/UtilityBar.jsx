import React from 'react';
import cn from 'classnames';

import './style.scss';

import UTILS from '../../data/utils.json';

import Menu, { Item } from '../MenuItem/MenuItem';

export default class UtilityBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: false,
    };
  }

  toggleMenu = () => {
    this.setState((prev) => ({ hidden: !prev.hidden }));
  }

  generateUtilMenu = () => Object.keys(UTILS).map(
    (file) => {
      const filename = file.split('.')[0];
      return (
        <Menu
          label={`${filename.split('').shift().toUpperCase()}${filename.substring(1, filename.length)}`}
          expandable
          expanded={this.props.filename === filename}
        >
          {Object.keys(UTILS[file]).filter((x) => x !== 'description').map((func) => (
            <Item
              destination={`/u/${file}/${func}`}
              label={func}
              history={this.props.history}
              highlighted={this.props.utility === func}
            />
          ))}
        </Menu>
      );
    },
  )

  render() {
    const { hidden } = this.state;
    return (
      <div className={cn('u-sidebar', { hidden })}>
        <div className="utilitybar-header">
          <Item label="HELPER FUNCTIONS" history={this.props.history} destination="/u" />
        </div>
        {this.generateUtilMenu()}
      </div>
    );
  }
}
