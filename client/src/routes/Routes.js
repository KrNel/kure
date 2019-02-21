import React from 'react';
import { Route, Switch } from 'react-router-dom';

import App from '../App';
import Home from '../components/pages/Home/Home';
import Groups from '../components/pages/Groups/Groups';
import Posts from '../components/pages/Posts/Posts';
import Kurate from '../components/pages/Kurate/Kurate';
import Manage from '../components/pages/Manage/Manage';
import Logout from '../components/Auth/Logout';
import AuthSC from '../components/Auth/AuthSC';
import PrivateRoute from './PrivateRoute';
import NoMatch from './NoMatch';

/**
 *  Routing component to render various page components.
 *
 *  @returns {Component} Renders the route for main page components
 */
const Routes = (props) => (
  <App>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/groups' component={Groups} />
      <Route path='/posts' component={Posts} />
      <Route path='/kurate' component={Kurate} />
      <Route path='/success' component={AuthSC} />
      <PrivateRoute path='/manage' component={Manage} />
      <Route path='/logout' component={Logout} />
      <Route path='/:category/@:author/:permlink' component={Kurate} />
      <Route component={NoMatch} />
    </Switch>
  </App>
)

export default Routes;
