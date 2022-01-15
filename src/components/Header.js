import React, { useEffect, useState } from "react";
import styles from "../styles/Header.module.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function Header(props) {

  const {userCache, theme, systemDark} = props;
  let state = {
    cachedResults: useState(),
    userSearching: useState(false),
    searchResults: useState(null),
    query: useState(props.query || ""),
    inputFocused: useState(false),
    redirect: useState()
  };

  useEffect(async () => {

    //if (oldState.cachedResults === state.cachedResults[0] && (oldState.query === state.query[0] || oldState.redirect && oldState.query !== "")) return;
    
    try {

      // Get all article names
      const articleResponse = !state.cachedResults[0] && await fetch(`${process.env.RAZZLE_WIKI_SERVER}/pages`, {
        headers: {
          token: props.token
        }
      });
      const articleJson = state.cachedResults || (articleResponse.ok && await articleResponse.json());
      const {query} = state;

      if (query[0] && articleJson) {

        state.cachedResults[1](articleJson, () => {

          // Search through articles to find those that start with our query
          const searchRegex = new RegExp(`^${query[0].replaceAll(" ", "_")}`, "gi");
          const nearMatches = query !== "" ? articleJson.filter(article => article.name.match(searchRegex)) : [];

          if (nearMatches[0]) {

            // Now, sort the matches
            const elements = [];
            for (let i = 0; (nearMatches.length > 5 ? 5 : nearMatches.length) > i; i++) {

              const name = nearMatches[i].name;
              const spacedName = name.replaceAll("_", " ");
              elements.push(
                <li key={i}><a onClick={(e) => {

                  e.preventDefault();
                  document.activeElement.blur();
                  state.redirect[1](spacedName);
                  state.query[1]("", () => props.history.push(`/articles/${name}`));
                  
                }} href={`/articles/${name}`}>{spacedName}</a></li>
              );

            }

            // Finally, show the matches
            state.searchResults[1](elements);

          }

        });

      } else {

        state.searchResults[1](null);

      }

    } catch (err) {

      console.log(`Couldn't search pages: ${err.message}`);

    }

  }, [state.cachedResults[0], state.query[0], state.redirect[0]]);

  return (
    <header className={theme !== 1 && (theme !== 2 || !systemDark) ? "day" : null}>
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
          state.redirect[1](null);

        }} placeholder={state.redirect[0] || "Search for or create a page..."} value={state.query[0]} />
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
          <Link to="/login" id={styles["login-button"]}>
            Login
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