import React, { Component } from 'react';

class Login extends Component {
  constructor(props) {
    super(props);
    this.loginSC(props.scURL);
  }

  loginSC = (url) => {
    window.location = url;
  }

  render() {
    return (
      <div>
        Redirecting to Steem Connect login page...
      </div>
    )
  }
}

export default Login;
