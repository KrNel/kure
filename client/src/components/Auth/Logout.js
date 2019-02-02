import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Grid, Segment, Header } from "semantic-ui-react";
import { connect } from 'react-redux';
import Loading from '../Loading/Loading'

import { handleLogout } from '../../actions/authActions';

class Logout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false
    };

    this.removeToken();
  }

  componentDidMount() {
    this.interval = setTimeout(() => this.setState({ redirect: true }), 2000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  removeToken = () => {
    const { dispatch } = this.props;
    dispatch(handleLogout());
  }

  render () {
    const { redirect } = this.state;
    return (
      <div>
        {
        (redirect)
          ? <Redirect to='/' />
          :
            (
              <Grid verticalAlign='middle' columns={5} centered style={{height: "80vh"}}>
                <Grid.Row>
                  <Grid.Column>
                    <Loading text='Logging you out...' size='huge' />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            )
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { isAuth } = state.auth;

  return {
    isAuth
  }
}

export default connect(mapStateToProps)(Logout)
