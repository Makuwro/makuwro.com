import React, { useState } from "react";
import styles from "../styles/Header.module.css";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";

export default function Header({currentUser, theme, systemDark, query, history, setLocation}) {

  const location = useLocation();
  let state = {
    searchResults: useState(null),
    query: useState(query || ""),
    inputFocused: useState(false)
  };

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
        {currentUser && currentUser.id ? (
          <>
            <button title="Preferences" onClick={() => history.push("/preferences")} id={styles["account-button"]} style={{
              backgroundImage: `url(https://cdn.makuwro.com/${currentUser.avatarPath})`,
              backgroundSize: "cover",
              backgroundColor: "gray"
            }}></button>
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
  userData: PropTypes.object,
  articleContainer: PropTypes.any,
  history: PropTypes.object,
  query: PropTypes.string,
  theme: PropTypes.number,
  systemDark: PropTypes.bool
};