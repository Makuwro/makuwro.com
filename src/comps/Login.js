import React from "react";
import "../styles/login.css";

function Login() {

  document.title = "Login to The Showrunners Wiki";

  return (
    <main id="login-container">
      <div>Shh...</div>
      <button id="login-button">Login with GitHub</button>
    </main>
  );

}

export default Login;