import React from "react";
import "../styles/login.css";

class Login extends React.Component {
  
  constructor(props) {

    super(props);

  }
  
  render() {

    return (
      <main id="login-container">
        <div>Shh...</div>
        <button id="login-button">Login with GitHub</button>
      </main>
    );

  }

}

export default Login;