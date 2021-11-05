import React, { useRef } from "react";
import Header from "./Header";
import styles from "../styles/Authentication.module.css";
import { Link } from "react-router-dom";

export default function UserRegistration() {

  document.title = "Register an account on The Showrunners Wiki";
  const openDialog = (e, title, description) => {

    e.preventDefault();
    //React.createElement(Explanation, {title: title, description: description}, null);
    alert(description);

  };

  const submitButton = useRef();
  let processing = false;
  const sendAccountCreationRequest = async (e) => {

    // Don't refresh the page automatically
    e.preventDefault();

    // We don't want to spam the server ;)
    if (processing) return;
    processing = true;

    // Gray the registration button
    submitButton.current.classList.add("unavailable");

    try {



    } catch (err) {

      console.log(`Couldn't create account: ${err.message}`);
      processing = false;

    };

  };

  const inputPassword = useRef();
  const inputPasswordConfirm = useRef();
  const validatePassword = () => {

    if (inputPassword.current.value === inputPasswordConfirm.current.value) {

      inputPasswordConfirm.current.classList.remove("invalid");

    } else {

      inputPasswordConfirm.current.classList.add("invalid");

    };

  };
  
  return (
    <>
      <Header />
      <main id={styles["auth-main"]}>
        <section>
          <section>To view and edit articles, you need an account.</section>
          <form onSubmit={sendAccountCreationRequest}>
            <section>
              <label htmlFor="username">Username<button tabIndex="-1" onClick={e => openDialog(e, "Username", "You will use this unique name to sign in.")}>?</button></label>
              <input type="text" name="username" required />
            </section>
            <section>
              <label htmlFor="contributorName">Contributor name<button tabIndex="-1" onClick={e => openDialog(e, "Contributor name", "This name will be shown when you edit articles.")}>?</button></label>
              <input type="text" name="contributorName" />
            </section>
            <section>
              <label htmlFor="email">Email address<button tabIndex="-1" onClick={e => openDialog(e, "Email address", "This address will be used to verify your identity if you need your password reset.")}>?</button></label>
              <input type="email" name="email" />
            </section>
            <section>
              <label htmlFor="password">Password<button tabIndex="-1" onClick={e => openDialog(e, "Password", "This, along with your username, will be used to log you in.")}>?</button></label>
              <input ref={inputPassword} onBlur={validatePassword} type="password" name="password" required />
            </section>
            <section>
              <label htmlFor="passwordConfirm">Confirm password<button tabIndex="-1" onClick={e => openDialog(e, "Confirm password", "just type your password again")}>?</button></label>
              <input ref={inputPasswordConfirm} onBlur={validatePassword} onChange={validatePassword} type="password" name="passwordConfirm" required />
            </section>
            <section>
              <label htmlFor="registrationCode">Registration code<button tabIndex="-1" onClick={e => openDialog(e, "Registration code", "You must enter the code given to you by the administrators to sign up to the wiki.")}>?</button></label>
              <input type="text" name="registrationCode" />
            </section>
            <section style={{display: "flex", alignItems: "center", marginTop: "2rem"}}>
              <input ref={submitButton} type="submit" value="Create account" />
              <Link to="/login" style={{color: "white", marginLeft: "1rem", border: "none"}}>Sign in instead</Link>
            </section>
          </form>
        </section>
      </main>
    </>
  );

}