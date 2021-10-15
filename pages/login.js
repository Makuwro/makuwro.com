import router from "next/router";
import React from "react";
import Header from "../components/Header";
import styles from "../styles/Login.module.css";

function Login() {
  
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

          const urlSearchParams = new URLSearchParams(window.location.search);
          const redirect = urlSearchParams.get("redirect");
          router.push(redirect || "/");

        }

      }
      
    }, 1000);

  }

  if (typeof document !== "undefined") {
    
    document.title = "Login to The Showrunners Wiki";

    return (
      <>
        <Header />
        <main id={styles["login-container"]}>
          <div>Shh...</div>
          <button id={styles["login-button"]} onClick={openAuthWindow}>Login with GitHub</button>
        </main>
      </>
    );

  }

  return null;

}

export default Login;