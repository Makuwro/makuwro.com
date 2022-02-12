import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Authenticator.module.css";

export default function Authenticator(props) {

  const [buttonDisabled, setButtonDisabled] = useState(false);

  async function authenticate(event) {

    event.preventDefault();

    if (!buttonDisabled) {

      setButtonDisabled(true);

    }

  }

  return (
    <section id={styles.authenticator}>
      <h1>Welcome back to Makuwro!</h1>
      <form onSubmit={authenticate}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" required />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" required />
        <p>I forgot my password</p>
        <input type="submit" disabled={buttonDisabled} />
        <p>Don't have an account? <Link to="/register">Make one!</Link></p>
      </form>
    </section>
  );

}