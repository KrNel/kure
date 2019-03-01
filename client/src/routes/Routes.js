import React from 'react';
import { Route, Switch } from 'react-router-dom';

import App from '../App';
import Home from '../components/pages/Home/Home';
import Groups from '../components/pages/Groups/Groups';
import GroupDetails from '../components/pages/Groups/GroupDetails';
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
      <Route exact path='/groups' component={Groups} />
      <Route exact path='/posts' component={Posts} />
      <Route exact path='/kurate' component={Kurate} />
      <Route path='/success' component={AuthSC} />
      <PrivateRoute exact path='/manage' component={Manage} />
      <Route exact path='/logout' component={Logout} />
      {/*<Route exact path='/group/:group/' component={GroupDetails} />*/}
      <Route exact path='/group/:group/' render={props => <GroupDetails key={Date.now()} {...props} />} />
      <Route path='/:category/@:author/:permlink' component={Kurate} />
      <Route component={NoMatch} />
    </Switch>
  </App>
)

export default Routes;
