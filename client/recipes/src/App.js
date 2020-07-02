import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage'
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import NavBar from './components/NavBar';
import LogoutPage from './pages/LogoutPage';
import Footer from './components/Footer';

function App() {
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState({});
  const [userRecipes, setUserRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  var url;
  if (process.env.NODE_ENV == 'development') {
    url = "http://localhost:8000";
  } else {
    url = 'http://ec2-13-59-8-125.us-east-2.compute.amazonaws.com';
  }
  useEffect(() => {
    fetch(`${url}/api/auth/login/success`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    }).then(response => {
      if (response.status === 200) return response.json();
      throw new Error("failed to authenticate user");
    }).then(responseJSON => {
      setAuthenticated(true);
      setUserId(responseJSON.user._id);
      setUsername(responseJSON.user.name);
      setUserRecipes(responseJSON.user.recipeIDs);
    }).catch(err => {
      setAuthenticated(false);
      setError("Failed to authenticate user");
      console.log(error);
    });
  }, []);
  return (
    <Router>
      <NavBar user={{ name: username, id: userId, recipes: userRecipes }} authenticated={authenticated} />
      <Switch >
        <Route path="/" component={HomePage} exact />
        <Route path="/search" render={(props) => (
          <SearchPage {...props} url={url} user={{ name: username, id: userId, recipes: userRecipes}} authenticated={authenticated} setUserRecipes={setUserRecipes} />
        )}  />
        <Route path="/login" render={(props) => (
          <LoginPage {...props} url={url} />
        )} />
        <Route path="/profile" render={(props) => (
          <ProfilePage {...props} url={url} user={{ name: username, id: userId, recipes: userRecipes }} authenticated={authenticated} setUserRecipes={setUserRecipes} />
        )} />
        <Route path="/logout" render={(props) => (
          <LogoutPage url={url} setAuthenticated={setAuthenticated} />
        )} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
