import React  from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, } from "semantic-ui-react";

const Login = ({loginURL}) => (
  <div>
    <Grid verticalAlign='middle' columns={3} centered style={{height: "80vh"}}>
      <Grid.Row>
        <Grid.Column>
          <Card>
            <Card.Content textAlign='center'>
              <Card.Header>Login via:</Card.Header>
            </Card.Content>
            <Card.Content textAlign='center'>
              <Card.Description><a href={loginURL}><h4>SteemConnect</h4></a></Card.Description>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
)

Login.propTypes = {
  loginURL: PropTypes.string,
};

Login.defaultProps = {
  loginURL: '',
};

export default Login;
