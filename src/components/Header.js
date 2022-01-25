import React, { useState } from "react";
import styles from "../styles/Header.module.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function Header(props) {

  const {userCache, theme, systemDark} = props;
  let state = {
    searchResults: useState(null),
    query: useState(props.query || ""),
    inputFocused: useState(false)
  };

  return (
    <header className={!systemDark && theme !== 2 ? "day" : null}>
      <section>
        <Link to="/" id={styles["wiki-name"]}>Makuwro</Link>
        <section>
          <Link to="/library">Library</Link>
          <Link to="/creators">Creators</Link>
        </section>
      </section>
      <form onFocus={() => state.inputFocused[1](true)} onBlur={() => state.inputFocused[1](false)} id={styles["search-box"]}>
        <input type="text" className={!state.searchResults || !state.inputFocused ? styles["no-results"] : null} onInput={(e) => {
          
          state.query[1](e.target.value);

        }} placeholder="Search for or create a page..." value={state.query[0]} />
        <ul id={styles["search-results"]}>
          {state.searchResults[0]}
        </ul>
      </form>
      <section>
        {userCache && userCache._id ? (
          <>
            <button>
              Share
            </button>
            <button title="Preferences" onClick={() => props.history.push("/preferences")} id={styles["account-button"]} style={{
              backgroundImage: `url(${userCache.avatar_url})`,
              backgroundSize: "cover"
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
  userCache: PropTypes.object,
  token: PropTypes.string,
  articleContainer: PropTypes.any,
  history: PropTypes.object,
  query: PropTypes.string,
  theme: PropTypes.number,
  systemDark: PropTypes.bool
};