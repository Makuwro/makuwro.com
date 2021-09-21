import React from "react";
import { useHistory } from "react-router";
import "../styles/login.css";

function Login() {

  document.title = "Login to The Showrunners Wiki";

  const history = useHistory();
  function openAuthWindow() {
    
    const loginWindow = window.open("https://github.com/login/oauth/authorize?client_id=1583e1bf2395769aeee6&scope=repo,user:email", "The Showrunners Wiki", "height=400,width=400"); 
    const timer = setInterval(function() {

      if (loginWindow.closed) {

        // Stop the timer
        clearInterval(timer);
        
        // Check if we're authorized
        const value = `; ${document.cookie}`;
        const parts = value.split("; access_token=");
        if (parts.length === 2 && parts.pop().split(";")[0]) {

          history.push("/");

        }

      }
      
    }, 1000);

  }

  return (
    <main id="login-container">
      <div>Shh...</div>
      <button id="login-button" onClick={openAuthWindow}>Login with GitHub</button>
    </main>
  );

}

export default Login;