import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/Authenticator.module.css";
import BirthdateDropdown from "./input/BirthdateDropdown";
import Checkbox from "./input/Checkbox";
import Dropdown from "./input/Dropdown";
import Popup from "./Popup";

export default function Authenticator({onSuccess, open, addNotification, shownLocation}) {

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState([]);
  const [register, setRegister] = useState(false);
  const {pathname} = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {

    setRegister(pathname === "/register");

  }, [pathname]);

  function onClose() {

    if (shownLocation.pathname === "/signin" || shownLocation.pathname === "/register") {

      navigate("/");

    } else {

      navigate(shownLocation);

    }

  }

  return (
    <Popup title="Welcome back to Makuwro!" open={open} width="620px" onClose={onClose}>
      <section id={styles.authenticator}>
        <form onSubmit={authenticate}>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" required value={username} onInput={(event) => setUsername(event.target.value)} />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" required value={password} onInput={(event) => setPassword(event.target.value)} />
          {register ? (
            <>
              <label>Email address</label>
              <p>This will be used for authenticating you.</p>
              <input type="email" required value={email} onInput={(event) => setEmail(event.target.value)} />
              <label>Birth date</label>
              <p>We'll use this to ensure you're old enough to access Makuwro and age-gated content. Lying about your age is against the terms of service.</p>
              <BirthdateDropdown />
              <Checkbox required>
                I accept the <a href="https://help.makuwro.com/policies/terms">terms of service</a> and <a href="https://help.makuwro.com/policies/privacy">privacy policy</a>
              </Checkbox>
            </>
          ) : (
            <p>I forgot my password</p>
          )}
          <input type="submit" disabled={buttonDisabled} value={register ? "Sign up" : "Sign in"} />
          {register ? <Link to="/signin">I already have an account</Link> : <p>Don't have an account? <Link to="/register">Make one!</Link></p>}
        </form>
      </section>
    </Popup>
  );

}