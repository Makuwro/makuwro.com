import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Authenticator.module.css";
import Popup from "./Popup";

export default function Authenticator({onSuccess, open, addNotification}) {

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function authenticate(event) {

    event.preventDefault();

    if (!buttonDisabled) {

      let response;
      let session;

      // Please don't send more requests at the moment.
      setButtonDisabled(true);

      // Send the request to the server.
      response = await fetch(`${process.env.RAZZLE_API_DEV}accounts/user/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          username,
          password
        }
      });

      // Make sure the request was successful.
      session = await response.json();
      if (!response.ok) {
        
        console.log(`An error happened while logging in: ${session.message}`);
        setButtonDisabled(false);
        return;

      }

      // Log the token as a cookie.
      document.cookie = `token=${session.token}; max-age=63072000; secure; path=/`;

      // Let's get outta here!
      onSuccess();

    }

  }

  useEffect(() => {
    
    if (open) {

      document.title = "Sign in to Makuwro";

    }

  }, [open]);

  return (
    <Popup title="Welcome back to Makuwro!" open={open}>
      <section id={styles.authenticator}>
        <form onSubmit={authenticate}>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" required value={username} onInput={(event) => setUsername(event.target.value)} />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" required value={password} onInput={(event) => setPassword(event.target.value)} />
          <p>I forgot my password</p>
          <input type="submit" disabled={buttonDisabled} />
          <p>Don't have an account? <Link to="/register">Make one!</Link></p>
        </form>
      </section>
    </Popup>
  );

}