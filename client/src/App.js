import React, { Fragment } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/landing'
import Register from './components/auth/register'
import Login from './components/auth/login'
import './App.css';
import landing from './components/layout/landing';

const App = () =>
  <Router>
    <Fragment>
      <Navbar />
      <Route exact path='/' component={Landing} />
      <section className="container" />
      <Route exact path='/login' component={Login} />
      <Route exact path='/register' component={Register} />
      <section />
    </Fragment>
  </Router>


export default App;
