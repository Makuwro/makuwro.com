import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/Authenticator.module.css";
import BirthdateDropdown from "./input/BirthdateDropdown";
import Checkbox from "./input/Checkbox";
import PropTypes from "prop-types"; 
import Popup from "./Popup";

export default function Authenticator({client, open, shownLocation}) {

  const navigate = useNavigate();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [popupOpen, setPopupOpen] = useState(open);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [birthDate, setBirthDate] = useState();
  const [register, setRegister] = useState(false);
  const {pathname} = useLocation();

  function onClose(authenticated) {

    if (shownLocation.pathname === "/signin" || shownLocation.pathname === "/register") {

      if (authenticated) {

        return location.replace("/");

      }

      navigate("/", {replace: true});

    } else {

      if (authenticated) {

        return location.replace(shownLocation.pathname);

      }

      navigate(shownLocation, {replace: true});

    }
    
    setPopupOpen(false);
    setBirthDate();
    setUsername("");
    setPassword("");
    setEmail("");
    setTermsAccepted(false);
    setButtonDisabled(false);

  }

  async function authenticate(event) {

    event.preventDefault();

    if (!buttonDisabled) {

      // Please don't send more requests at the moment.
      setButtonDisabled(true);

      if (register) {

        if (!birthDate || !(birthDate instanceof Date) || isNaN(birthDate)) {

          alert("Please enter a valid birthdate.");
          setButtonDisabled(false);
          return;

        }

        try {

          // Send a request to the server to create the account.
          await client.createUser({username, password, birthDate, email});

        } catch (err) {

          console.error(err);
          alert(`Couldn't create account: ${err.message}`);
          setButtonDisabled(false);
          return;

        }

      }

      try {

        // Send the request to the server.
        const {token} = await client.createSession(username, password);

        // Log the token as a cookie.
        document.cookie = `token=${token}; max-age=63072000; secure; path=/`;

        // Let's get outta here!
        onClose(true);

      } catch (err) {
        
        alert(`Couldn't log in: ${err.message}`);
        setButtonDisabled(false);

      }

    }

  }

  useEffect(() => {

    const {user} = client;
    if ((location.pathname === "/signin" || location.pathname === "/register") && open && user) {

      alert(`You're already signed in, ${user.displayName || user.username}!`);
      return onClose();

    }

    if (pathname === "/register") {

      document.title = "Create a Makuwro account";
      setRegister(true);
      setPopupOpen(true);
      
    } else if (pathname === "/signin") {

      document.title = "Sign in to Makuwro";
      setRegister(false);
      setPopupOpen(true);

    }

  }, [client.user, pathname, open]);

  return (
    <Popup 
      title={`Welcome${!register ? " back" : ""} to Makuwro!`} 
      onClose={() => {
      
        setPopupOpen(false);
        onClose();

      }}
      open={popupOpen}
      options={
        <>
          <button disabled={buttonDisabled} onClick={authenticate}>{register ? "Sign up" : "Sign in"}</button>
          {register ? <Link to="/signin">I already have an account</Link> : <p>Don't have an account? <Link to="/register">Make one!</Link></p>}
        </>
      }>
      <section id={styles.authenticator}>
        <form onSubmit={authenticate}>
          <label htmlFor="username">Username</label>
          {register && <p>This will be used for users to uniquely identify you.</p>}
          <input type="text" name="username" required value={username} onChange={(event) => setUsername(event.target.value)} autoFocus />
          <label htmlFor="password">Password</label>
          {register && <p>You will use this to verify your identity.</p>}
          <input type="password" name="password" required value={password} onInput={(event) => setPassword(event.target.value)} />
          {register ? (
            <>
              <label>Email address</label>
              <p>This will be used for authenticating you.</p>
              <input type="email" required value={email} onInput={(event) => setEmail(event.target.value)} />
              <label>Date of birth</label>
              <p>We'll use this to ensure you're old enough to access Makuwro and age-gated content. Lying about your age is against the terms of service.</p>
              <BirthdateDropdown onChange={(birthDate) => setBirthDate(birthDate)} />
              <Checkbox required checked={termsAccepted} onClick={(accepted) => setTermsAccepted(accepted)}>
                I accept the <a href="https://help.makuwro.com/policies/terms">terms of service</a> and <a href="https://help.makuwro.com/policies/privacy">privacy policy</a>
              </Checkbox>
            </>
          ) : (
            <p>I forgot my password</p>
          )}
        </form>
      </section>
    </Popup>
  );

}

Authenticator.propTypes = {
  client: PropTypes.object.isRequired,
  open: PropTypes.bool,
  shownLocation: PropTypes.object
};