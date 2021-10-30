import React from "react";
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
  
  return (
    <>
      <Header />
      <main id={styles["auth-main"]}>
        <section>
          <section>To view and edit articles, you need an account.</section>
          <form>
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
              <input type="password" name="password" required />
            </section>
            <section>
              <label htmlFor="password">Confirm password<button tabIndex="-1" onClick={e => openDialog(e, "Confirm password", "just type your password again")}>?</button></label>
              <input type="password" name="password" required />
            </section>
            <section>
              <label htmlFor="registrationCode">Registration code<button tabIndex="-1" onClick={e => openDialog(e, "Registration code", "You must enter the code given to you by the administrators to sign up to the wiki.")}>?</button></label>
              <input type="text" name="registrationCode" />
            </section>
            <section style={{display: "flex", alignItems: "center", marginTop: "2rem"}}>
              <input type="submit" value="Create account" />
              <Link to="/login" style={{color: "white", marginLeft: "1rem", border: "none"}}>Sign in instead</Link>
            </section>
          </form>
        </section>
      </main>
    </>
  );

}