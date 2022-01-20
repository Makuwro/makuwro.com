import React, { useRef } from "react";
import styles from "../styles/Authentication.module.css";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function Login({setToken}) {

  // Set page title
  document.title = "Welcome back to Makuwro";

  const urlSearchParams = new URLSearchParams(window.location.search);
  const redirect = urlSearchParams.get("redirect") || "/";
  const history = useNavigate();
  const checkAuth = () => {

    const value = `; ${document.cookie}`;
    const parts = value.split("; token=");
    if (parts.length === 2 && parts.pop().split(";")[0]) {

      // Redirect us to the page we wanted to go to, or the home page
      history.replace(redirect);
      return true;

    }

  };
  const openDialog = (e, title, description) => {

    e.preventDefault();
    alert(description);

  };

  const usernameBox = useRef();
  const passwordBox = useRef();
  const submitButton = useRef();
  const submitForm = async (e) => {

    // Don't refresh the page, please!
    e.preventDefault();

    // Lock the boxes so we don't disrupt the authentication
    usernameBox.current.readOnly = true;
    passwordBox.current.readOnly = true;
    submitButton.current.disabled = true;

    try {

      // Make sure we're online
      if (navigator.offline) throw new Error("You're offline!");

      // Get a token from the server
      const username = usernameBox.current.value;
      const password = passwordBox.current.value;
      const serverResponse = await fetch(`${process.env.RAZZLE_WIKI_SERVER}/accounts/sessions`, {
        method: "POST",
        headers: {
          username: username,
          password: password
        }
      });

      // Throw if something went wrong
      if (!serverResponse.ok) throw new Error(`${serverResponse.status}: ${serverResponse.statusText}`);

      // Save the token as a cookie
      const resJson = await serverResponse.json();
      const token = resJson.token;
      document.cookie = `token=${token};`;
      
      // Everything's good!
      console.log("Set token as a cookie. Redirecting...");
      setToken(token, redirect);

    } catch (err) {

      console.log(`Couldn't sign you in: ${err.message}`);

    }
    
  };

  // Don't return anything if we're already authorized
  return checkAuth() ? null : (
    <>
      <main id={styles["auth-main"]}>
        <section>
          <section>To view and edit articles, you need an account.</section>
          <form onSubmit={submitForm}>
            <section>
              <label htmlFor="username">Username<button tabIndex="-1" onClick={e => openDialog(e, "Username", "This is the unique name you used to sign up.")}>?</button></label>
              <input ref={usernameBox} type="text" name="username" required />
            </section>
            <section>
              <label htmlFor="password">Password<button tabIndex="-1" onClick={e => openDialog(e, "Password", "This is the secret phrase you used to sign up.")}>?</button></label>
              <input ref={passwordBox} type="password" name="password" required />
              <a onClick={(e) => {

                e.preventDefault();
                alert("i forog");

              }} style={{cursor: "pointer", color: "white", marginTop: "1rem", padding: 0, backgroundColor: "transparent", border: "none", display: "inline-block"}}>I forgot my password</a>
            </section>
            <section style={{display: "flex", alignItems: "center", marginTop: "2rem"}}>
              <input ref={submitButton} type="submit" value="Sign in" />
              <Link to="/register" style={{color: "white", marginLeft: "1rem", border: "none"}}>Create an account instead</Link>
            </section>
          </form>
        </section>
      </main>
    </>
  );

}

Login.propTypes = {
  setToken: PropTypes.func
};