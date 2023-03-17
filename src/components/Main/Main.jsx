import React from 'react';
import { connect } from 'react-redux';
import './style.scss';
import cn from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import { Switch, Route } from 'react-router-dom';

import Sidebar from '../Sidebar/Sidebar';
import CodePage from '../CodePage/CodePage';
import { SolutionHub, UtilityHub } from '../Hubs';
import Topbar from '../TopBar/TopBar';
import Home from '../Home/Home';

class Main extends React.Component {
  state = {
    topbarHidden: false,
    ubarHidden: false,
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
        this.setState({ solutionId, utility: '' }, () => {
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
        this.setState({ filename, utility, solutionId: 0 }, () => window.scrollTo(0, 0));
      }
    }
  }

  toggleMenu = () => {
    this.setState((prev) => ({ ubarHidden: !prev.ubarHidden }));
  }

  render() {
    const {
      topbarHidden, solutionId, filename, utility,
    } = this.state;
    const { history, darkMode } = this.props;
    return (
      <div className={cn('main', { dark: darkMode })}>
        <div className={cn('topbar', { hidden: topbarHidden })}>
          <Topbar />
        </div>
        <div className="main-content">
          <div className="main-content__left">
            <Sidebar history={history} solutionId={solutionId} utility={utility} />
          </div>
          <div className={cn('main-content__center')}>
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
                      filename={filename}
                      utility={utility}
                    />
                  )
                }
              />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    darkMode: state.darkMode, 
  }
}

export default connect(mapStateToProps)(Main)