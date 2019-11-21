/* eslint react/jsx-filename-extension: 0 */

import React from 'react';
import {
  Switch, Route, BrowserRouter, Link,
} from 'react-router-dom';
import './App.css';
import Main from './components/Main/Main.jsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route
            path="/"
            component={Main}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
