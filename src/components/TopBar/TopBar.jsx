import React from 'react';
import { connect } from 'react-redux';
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

class TopBar extends React.Component {
  render() {
    const { darkMode } = this.props;
    return (
      <div className="topbar">
        <Link to="/e"><div className="topbar__side left">SOLUTIONS</div></Link>
        <div className="topbar__center">
          <h2><Link to="/">project euler blog</Link></h2>
        </div>
        <div className="topbar__quick-links">
          <button className="toggle-dark" type="button" onClick={() => this.props.toggleDark(this.props.darkMode)}>
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
          <button className="toggle-dark" type="button" onClick={() => { window.location = 'https://github.com/zheng214/blog-euler'; }}>
            <FontAwesomeIcon icon={faGithub} />
          </button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleDark: (darkMode) => { dispatch({ type: 'TOGGLE_DARK', darkMode }) }
  }
}

const mapStateToProps = (state) => {
  return {
    darkMode: state.darkMode,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);