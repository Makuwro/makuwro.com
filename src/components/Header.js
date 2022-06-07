import React, { useState } from "react";
import styles from "../styles/Header.module.css";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header({client, theme, systemDark, query, setLocation}) {

  const location = useLocation();
  const navigate = useNavigate();
  let state = {
    searchResults: useState(null),
    query: useState(query || ""),
    inputFocused: useState(false)
  };
  const {user} = client;

  return (
    <header className={!systemDark && theme !== 2 ? "day" : null}>
      <section>
        <Link to="/" onClick={() => setLocation(location)} id={styles["wiki-name"]}>Makuwro</Link>
        <section id={styles.leftLinks}>
          <Link to="/library">Library</Link>
        </section>
      </section>
      <form onFocus={() => state.inputFocused[1](true)} onBlur={() => state.inputFocused[1](false)} id={styles["search-box"]}>
        <input type="text" className={!state.searchResults || !state.inputFocused ? styles["no-results"] : null} onInput={(e) => {
          
          state.query[1](e.target.value);

        }} placeholder="Search for something! I dare you." value={state.query[0]} />
        <ul id={styles["search-results"]}>
          {state.searchResults[0]}
        </ul>
      </form>
      <section>
        {user ? (
          <>
            <button id={styles.notificationsButton} onClick={() => navigate("/notifications")}>
              <span className="material-icons-round">
                notifications
              </span>
            </button>
            <button title={`${`${user.displayName} (` || ""}@${user.username}${user.displayName ? ")" : ""}`} onClick={() => navigate(`/${user.username}`)} id={styles.accountButton}>
              <img alt="Avatar" src={`https://cdn.makuwro.com/${user.id}/avatar`} />
            </button>
          </>
        ) : (
          <Link to="/signin" id={styles["login-button"]}>
            Sign in
          </Link>
        )}
      </section>
    </header>
  );

}

Header.propTypes = {
  client: PropTypes.object,
  setLocation: PropTypes.func,
  query: PropTypes.string,
  theme: PropTypes.number,
  systemDark: PropTypes.bool,
  addPopup: PropTypes.func
};