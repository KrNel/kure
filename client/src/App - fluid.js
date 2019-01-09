import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid, Container } from "semantic-ui-react";

import Home from './pages/Home';
import Groups from './pages/Groups';
import Posts from './pages/Posts';
import Kurate from './pages/Kurate';
//import Manage from './pages/Manage';
import NavMenu from './components/nav/NavMenu';
import './styles/App.css';
/*import { Button } from 'semantic-ui-react'

import logo from './logo.svg';
import './App.css';
import "semantic-ui-css/semantic.css";*/

const NoMatch = ({ location }) => (
  <div className='ui inverted red raised very padded text container segment'>
    <strong>Error!</strong> No route found matching:
    <div className='ui inverted black segment'>
      <code>{location.pathname}</code>
    </div>
  </div>
);

/*
Make fixed width main, option to choose fluid width?
*/
class App extends Component {
  render () {
    return (
      <div>
        <Grid>
          <Grid.Column>
            <NavMenu />
          </Grid.Column>
        </Grid>
        {/*<Container>*/}
        {/*<Grid columns={16} padded>*/}

        <Grid padded>
          <Grid.Column width={16}>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/groups' component={Groups} />
              <Route path='/posts' component={Posts} />
              <Route path='/kurate' component={Kurate} />
              {/*<Route path='/login' component={Login} />
            <Route path='/logout' component={Logout} />*/}
              {/*<PrivateRoute path='/manage' component={Manage} />*/}
              <Route component={NoMatch} />
            </Switch>
            {/*</Container>*/}
          </Grid.Column>
        </Grid>

        {/*</Grid>*/}
      </div>
    );
  }
}

export default App;
