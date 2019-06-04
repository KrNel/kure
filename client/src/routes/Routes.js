import React from 'react';
import { Route, Switch } from 'react-router-dom';

import App from '../App';
import Home from '../components/pages/Home/Home';
import Groups from '../components/pages/Groups/Groups';
import GroupDetails from '../components/pages/Groups/GroupDetails';
import Posts from '../components/pages/Kurated/Posts';
import Post from '../components/pages/Steem/Post/Post';
import Feed from '../components/pages/Steem/Feed/Feed';
import Blog from '../components/pages/Steem/Blog/Blog';
import Kurate from '../components/pages/Steem/Kurate';
import Manage from '../components/pages/Manage/Manage';
import Logout from '../components/Auth/Logout';
import AuthSC from '../components/Auth/AuthSC';
import Write from '../components/pages/Steem/Write/Write';
import Follows from '../components/pages/Steem/Follows/Follows';
import Wallet from '../components/pages/Steem/Wallet/Wallet';
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
      <Route exact path='/steem' component={Kurate} />
      <Route exact path='/groups' component={Groups} />
      <Route exact path='/kurated' component={Posts} />
      <PrivateRoute exact path='/manage' component={Manage} />
      <Route exact path='/logout' component={Logout} />
      <Route exact path='/created/:tag?' component={Kurate} />
      <Route exact path='/hot/:tag?' component={Kurate} />
      <Route exact path='/promoted/:tag?' component={Kurate} />
      <Route exact path='/trending/:tag?' component={Kurate} />
      <Route path='/:category/@:author/:permlink' component={Post} />
      <Route path='/@:author/wallet' component={Wallet} />
      <Route path='/@:author/feed' component={Feed} />
      <Route path='/@:author/followers' component={Follows} />
      <Route path='/@:author/following' component={Follows} />
      <Route path='/@:author' component={Blog} />
      <Route path='/success' component={AuthSC} />
      <Route exact path='/groups/group/:group/' component={GroupDetails} />
      <PrivateRoute exact path='/write' component={Write} />
      <Route component={NoMatch} />
    </Switch>
  </App>
)

export default Routes;
