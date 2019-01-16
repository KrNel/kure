import React from 'react';
import { Route } from 'react-router-dom';
import NotAuthorized from '../components/Auth/NotAuthorized';
import Authorizing from '../components/Auth/Authorizing';

const PrivateRoute = ({ component: Component, isAuthorizing, isAuth, ...rest }) => (
  <Route {...rest} render={(props) => (
    (isAuthorizing)
      ? <Authorizing />
    : (isAuth)
          ? <Component {...props} {...rest} />
          : <NotAuthorized />
  )} />
);

export default PrivateRoute;
