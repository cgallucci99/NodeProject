import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage'
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <Switch >
        <Route path="/" component={HomePage} exact />
        <Route path="/search" component={SearchPage} />
        <Route path="/login" component={LoginPage} />
      </Switch>
    </Router>
  );
}

export default App;
