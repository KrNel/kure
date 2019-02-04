import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Grid } from "semantic-ui-react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Loading from '../Loading/Loading'
import { handleLogout } from '../../actions/authActions';

/**
 *  Logout of the application.
 *
 *  Remove token cookie on client side, and remove sessions data from database.
 *  Timer set to 2 seconds to wait and then redirect user to homepage.
 *
 *  @param {object} props - Component props
 *  @param {function} props.dispatch - Dispatches logout action
 *  @param {bool} props.isAuth - Determines if user is authenticated
 *  @returns {Component} - Displays markup to wait 2 seconds for lofout
 */
class Logout extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuth: PropTypes.bool.isRequired,
  };

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
    const { dispatch, isAuth } = this.props;
    if (isAuth) dispatch(handleLogout());
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

/**
 *  Map redux state to component props.
 *
 *  @param {object} state - Redux state
 *  @returns {object} - Authentication data
 */
const mapStateToProps = state => {
  const { isAuth } = state.auth;

  return {
    isAuth
  }
}

export default connect(mapStateToProps)(Logout)
