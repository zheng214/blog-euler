/* eslint react/jsx-filename-extension: 0 */

import React from 'react';
import {
  Switch, Route, HashRouter, Link,
} from 'react-router-dom';
import './App.css';
import Main from './components/Main/Main.jsx';

function App() {
  return (
    <div className="App">
      <HashRouter basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route
            path="/"
            component={Main}
          />
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
