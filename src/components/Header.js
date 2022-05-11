import React, { useState } from "react";
import styles from "../styles/Header.module.css";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Popup from "./PopupManager";

export default function Header({currentUser, theme, systemDark, query, setLocation, addPopup}) {

  const location = useLocation();
  const navigate = useNavigate();
  let state = {
    searchResults: useState(null),
    query: useState(query || ""),
    inputFocused: useState(false)
  };

  return (
    <header className={!systemDark && theme !== 2 ? "day" : null}>
      <section>
        <button>
          <img src="/icons/hamburger-menu.svg" />
        </button>
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
            <button id={styles.notificationsButton} onClick={() => addPopup({
              title: "Notifications",
              children: <p>You don't got any, but rest assured: we'll tell you if someone likes your furry fanfiction.</p>
            })}>
              <img src="/icons/bell.svg" />
            </button>
            <button title={`${`${currentUser.displayName} (` || ""}@${currentUser.username}${currentUser.displayName ? ")" : ""}`} onClick={() => navigate(`/${currentUser.username}`)} id={styles.accountButton}>
              {currentUser && (
                <img src={currentUser.avatarUrl || `https://cdn.makuwro.com/${currentUser.avatarPath}`} />
              )}
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
  currentUser: PropTypes.object,
  setLocation: PropTypes.func,
  query: PropTypes.string,
  theme: PropTypes.number,
  systemDark: PropTypes.bool
};