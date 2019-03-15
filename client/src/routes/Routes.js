import React from 'react';
import { Route, Switch } from 'react-router-dom';

import App from '../App';
import Home from '../components/pages/Home/Home';
import Groups from '../components/pages/Groups/Groups';
import GroupDetails from '../components/pages/Groups/GroupDetails';
//import Posts from '../components/pages/Posts/Posts';
import Post from '../components/pages/Kurate/Post/Post';
import Feed from '../components/pages/Kurate/Feed/Feed';
import Blog from '../components/pages/Kurate/Blog/Blog';
import Kurate from '../components/pages/Kurate/Kurate';
import Manage from '../components/pages/Manage/Manage';
import Logout from '../components/Auth/Logout';
import AuthSC from '../components/Auth/AuthSC';
import Write from '../components/Write/Write';
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
      <Route exact path='/kurate' component={Kurate} />
      <Route exact path='/groups' component={Groups} />
      {/*<Route exact path='/kurated' component={Posts} />*/}
      <PrivateRoute exact path='/manage' component={Manage} />
      <Route exact path='/logout' component={Logout} />
      <Route path='/:category/@:author/:permlink' component={Post} />
      <Route path='/@:author/feed' component={Feed} />
      <Route path='/@:author' component={Blog} />
      <Route path='/success' component={AuthSC} />
      <Route exact path='/group/:group/' component={GroupDetails} />
      <Route exact path='/write' component={Write} />
      <Route component={NoMatch} />
    </Switch>
  </App>
)

export default Routes;
