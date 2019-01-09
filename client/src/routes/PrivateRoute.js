import React from 'react';
import { Route } from 'react-router-dom';
import NotAuthorized from '../components/Auth/NotAuthorized';

const PrivateRoute = ({ component, isAuth, ...rest }) => (
  <Route {...rest} render={(props) => (
    (isAuth) ? (
      React.createElement(component, props)
    ) : (
      /*<Redirect to={{
        pathname: '/login',
      }} />*/
      <NotAuthorized />
    )
  )} />
);

export default PrivateRoute;
