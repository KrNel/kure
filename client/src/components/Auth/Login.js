import React, { Component } from 'react';
import { Grid, Card, Checkbox } from "semantic-ui-react";

class Login extends Component {
  /*constructor(props) {
    super(props);
    //this.loginSC(props.scURL);
  }*/

  //props.loginURL

  /*loginSC = (url) => {
    window.location = url;
  }*/
  /*
    <div className="ui column stackable center grid">
      <div className="four wide column"></div>
      <div className="ui six wide column segment">
         Login
      </div>
    </div>
  */
  render() {
    return (
      <div>

        <Grid verticalAlign='middle' columns={3} centered style={{height: "80vh"}}>
          <Grid.Row>
            <Grid.Column>
              <Card>
                <Card.Content textAlign='center'>
                  <Card.Header>Login via:</Card.Header>
                </Card.Content>
                <Card.Content textAlign='center'>
                  <Card.Description><a href={this.props.loginURL}><h4>SteemConnect</h4></a></Card.Description>
                  {/*<Checkbox label='Auto-login' className="right floated" />*/}
                </Card.Content>
                {/*<Card.Content extra>
                  <i>The login cookie will only last 1 week unless auto-login is selected. Logout to delete the cookie anytime.</i>
                </Card.Content>*/}
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

export default Login;
