import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from '../components/pages/Home/Home';
import Groups from '../components/pages/Groups/Groups';
import Posts from '../components/pages/Posts/Posts';
import Kurate from '../components/pages/Kurate/Kurate';
import Manage from '../components/pages/Manage/Manage';
import Logout from '../components/Auth/Logout';
import PrivateRoute from './PrivateRoute';
//import Login from './Auth/Login';

const NoMatch = ({ location }) => (
  <div className='ui inverted red raised very padded text container segment'>
    <strong>Error!</strong> No route found matching:
    <div className='ui inverted black segment'>
      <code>{location.pathname}</code>
    </div>
  </div>
);

const Routes = ({onLogout, isAuth}) => {
  //console.log('scURL: ', scURL);

  return (
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/groups' component={Groups} />
      <Route path='/posts' component={Posts} />
      <Route path='/kurate' component={Kurate} />
      <PrivateRoute path='/manage' component={Manage} isAuth={isAuth} />
      {/*<Route path='/login' component={() => window.location = {url}} />*/}
      {/*<Route path='/login' component={Login} />*/}
      {/*<Route path='/login' render={()=><Login scURL={scURL} />} />*/}
      <Route path='/logout' render={()=><Logout onLogout={onLogout} />} />
      {/*https://github.com/ReactTraining/react-router/issues/4105*/}

      {/*<PrivateRoute path='/manage' component={Manage} />*/}
      <Route component={NoMatch} />
    </Switch>
  )
}

export default Routes;
