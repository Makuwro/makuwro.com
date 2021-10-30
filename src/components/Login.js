import React from "react";
import Header from "./Header";
import styles from "../styles/Authentication.module.css";
import { Link, useHistory } from "react-router-dom";

function Login() {

  // Set page title
  document.title = "Sign in to The Showrunners Wiki";

  const history = useHistory();
  const checkAuth = () => {

    const value = `; ${document.cookie}`;
    const parts = value.split("; access_token=");
    if (parts.length === 2 && parts.pop().split(";")[0]) {

      // Redirect us to the page we wanted to go to, or the home page
      const urlSearchParams = new URLSearchParams(window.location.search);
      const redirect = urlSearchParams.get("redirect");
      history.push(redirect + location.hash || "/");
      return true;

    }

  };
  const openDialog = (e, title, description) => {

    e.preventDefault();
    alert(description);

  };

  // Don't return anything if we're already authorized
  return checkAuth() ? null : (
    <>
      <Header />
      <main id={styles["auth-main"]}>
        <section>
          <section>To view and edit articles, you need an account.</section>
          <form>
            <section>
              <label htmlFor="username">Username<button tabIndex="-1" onClick={e => openDialog(e, "Username", "This is the unique name you used to sign up.")}>?</button></label>
              <input type="text" name="username" required />
            </section>
            <section>
              <label htmlFor="password">Password<button tabIndex="-1" onClick={e => openDialog(e, "Password", "This is the secret phrase you used to sign up.")}>?</button></label>
              <input type="password" name="password" required />
              <a onClick={(e) => {

                e.preventDefault();
                alert("i forog");

              }} style={{cursor: "pointer", color: "white", marginTop: "1rem", padding: 0, backgroundColor: "transparent", border: "none", display: "inline-block"}}>I forgot my password</a>
            </section>
            <section style={{display: "flex", alignItems: "center", marginTop: "2rem"}}>
              <input type="submit" value="Sign in" />
              <Link to="/register" style={{color: "white", marginLeft: "1rem", border: "none"}}>Create an account instead</Link>
            </section>
          </form>
        </section>
      </main>
    </>
  );

}

export default Login;