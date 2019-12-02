import React from 'react';
import './style.scss';
import cn from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDoubleRight,
} from '@fortawesome/free-solid-svg-icons';

import { Switch, Route } from 'react-router-dom';

import Sidebar from '../Sidebar/Sidebar';
import UtilityBar from '../UtilityBar/UtilityBar';
import CodePage from '../CodePage/CodePage';
import { SolutionHub, UtilityHub } from '../Hubs';
import Topbar from '../TopBar/TopBar';
import Home from '../Home/Home';

export default class Main extends React.Component {
  state = {
    topbarHidden: false,
    ubarHidden: false,
    darkModeOn: false,
    filename: '',
    utility: '',
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.updateLocation();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.updateLocation();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll');
  }

  handleScroll = () => {
    const previousYOffset = this.currentYOffset || 0;
    const currentYOffset = window.pageYOffset;
    this.currentYOffset = currentYOffset;
    const downScroll = currentYOffset - previousYOffset;
    const { topbarHidden } = this.state;
    if (topbarHidden && (currentYOffset <= 10 || downScroll < -5)) {
      this.setState({
        topbarHidden: false,
      });
    } else if (!topbarHidden && downScroll > 5) {
      this.setState({
        topbarHidden: true,
      });
    }
  }

  updateLocation = () => {
    const breadcrumbs = this.props.location.pathname.split('/');
    if (breadcrumbs[1] === 'e') {
      // solution view
      const solutionId = breadcrumbs[2];
      if (solutionId) {
        this.setState({ solutionId }, () => {
          if (this.props.history.location.scrollTo) {
            window.scrollTo(0, this.props.history.location.scrollTo);
          } else {
            window.scrollTo(0, 0);
          }
        });
      }
    } else if (breadcrumbs[1] === 'u') {
      // utility view
      const [_, _2, filename, utility] = breadcrumbs;
      if (filename && utility) {
        this.setState({ filename, utility }, () => window.scrollTo(0, 0));
      }
    }
  }

  toggleMenu = () => {
    this.setState((prev) => ({ ubarHidden: !prev.ubarHidden }));
  }

  toggleDark = () => {
    this.setState(
      (prev) => ({ darkModeOn: !prev.darkModeOn }),
      () => {
        document.body.style.backgroundColor = this.state.darkModeOn ? 'black' : 'white';
      },
    );
  }

  render() {
    const {
      ubarHidden, topbarHidden, darkModeOn, solutionId, filename, utility,
    } = this.state;
    const { history } = this.props;
    return (
      <div className={cn('main', { dark: darkModeOn })}>
        <div className={cn('topbar', { hidden: topbarHidden })}>
          <Topbar toggleDark={this.toggleDark} darkMode={darkModeOn} />
        </div>
        <div className="main-content">
          <div className="main-content__left">
            <Sidebar history={history} solutionId={solutionId} />
          </div>
          <div className={cn('main-content__center', { expanded: ubarHidden })}>
            <Switch>
              <Route exact path="/" render={(props) => <Home history={props.history} />} />
              <Route exact path="/e/" render={SolutionHub} />
              <Route
                path="/e/:eid?"
                render={
                  (props) => (
                    <CodePage
                      match={props.match}
                      history={props.history}
                      darkMode={darkModeOn}
                      location={props.location}
                      solutionId={solutionId}
                    />
                  )
                }
              />
              <Route exact path="/u/" render={UtilityHub} />
              <Route
                path="/u/:filename/:func"
                render={
                  (props) => (
                    <CodePage
                      match={props.match}
                      history={props.history}
                      darkMode={darkModeOn}
                      filename={filename}
                      utility={utility}
                    />
                  )
                }
              />
            </Switch>
          </div>
          {/* eslint-disable-next-line react/button-has-type */}
          <button className={cn('toggle-ubar', { hidden: ubarHidden })} onClick={this.toggleMenu}>
            <span><FontAwesomeIcon icon={faAngleDoubleRight} /></span>
          </button>
          <div className={cn('main-content__right', { hidden: ubarHidden })}>
            <UtilityBar history={history} filename={filename} utility={utility} />
          </div>
        </div>
      </div>
    );
  }
}
