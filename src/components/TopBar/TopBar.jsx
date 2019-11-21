import React from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSun,
  faMoon,
} from '@fortawesome/free-solid-svg-icons';

import {
  faGithub,
} from '@fortawesome/free-brands-svg-icons';

import './style.scss';

export default function TopBar({ darkMode, toggleDark }) {
  return (
    <div className="topbar">
      <div className="topbar__side left"><Link to="/e">SOLUTIONS</Link></div>
      <div className="topbar__center">
        <h2><Link to="/">PROJECT EULERS</Link></h2>
      </div>
      <div className="topbar__quick-links">
        <button className="toggle-dark" type="button" onClick={toggleDark}>
          <span><FontAwesomeIcon icon={darkMode ? faSun : faMoon} /></span>
        </button>
        <button className="toggle-dark" type="button" onClick={toggleDark}>
          <span><FontAwesomeIcon icon={faGithub} /></span>
        </button>
      </div>
      <div className="topbar__side right">
        <Link to="/u">HELPER FUNCTIONS</Link>
      </div>
    </div>
  );
}
