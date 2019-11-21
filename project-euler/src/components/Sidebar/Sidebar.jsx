import React from 'react';

import './style.scss';
import Menu, { Item } from '../MenuItem/MenuItem';
import SOLUTIONS from '../../data/solutions.json';

const SOLVED = SOLUTIONS.length;
const MENU_SECTIONS = Math.ceil(SOLVED / 10);

export default class Sidebar extends React.Component {
  generateSolutionMenu = () => [...Array(MENU_SECTIONS)].map(
    (_1, section) => {
      const start = 10 * section + 1;
      const end = Math.min(10 * section + 10, SOLVED);
      const { solutionId } = this.props;
      return (
        <Menu label={`${start} - ${end}`} expandable expanded={+solutionId >= start && +solutionId <= end}>
          {[...Array(end - start + 1)].map((_2, nth) => (
            <Item
              destination={`/e/${start + nth}`}
              id={start + nth}
              label={SOLUTIONS[start + nth - 1].title}
              history={this.props.history}
              highlighted={+this.props.solutionId === start + nth}
            />
          ))}
        </Menu>
      );
    }
  );

  render() {
    return (
      <div className="e-sidebar">
        <div className="sidebar-header">
          <Item label="SOLUTIONS" destination="/e" history={this.props.history} />
        </div>
        {this.generateSolutionMenu()}
      </div>
    );
  }
}
