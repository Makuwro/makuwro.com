import React, { useRef, useState } from "react";
import styles from "../styles/Header.module.css";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";

let cachedResults;

function Header(props) {

  // Create refs
  const searchBox = useRef();
  const searchResultsRef = useRef();

  // Set initial state
  const [searchResults, setSearchResults] = useState(null);
  const {token, userCache} = props;

  const history = useHistory();
  async function userSearching() {

    const inputBox = this.searchBox.current.firstChild;
    
    try {

      // Get all article names
      const articleResponse = !cachedResults && await fetch(`${process.env.RAZZLE_WIKI_SERVER}/pages?type=article`, {
        headers: {
          token: token
        }
      });
      const articleJson = cachedResults || (articleResponse.ok && await articleResponse.json());

      if (articleJson && articleJson.tree) {

        cachedResults = articleJson;

        // Search through articles to find those that start with our query
        const searchRegex = new RegExp(`^${inputBox.value.replaceAll(" ", "_")}`, "gi");
        const nearMatches = articleJson.tree.filter(article => article.path.match(searchRegex));
        
        if (nearMatches[0]) {

          // Now, sort the matches
          const elements = [];
          for (let i = 0; (nearMatches.length > 5 ? 5 : nearMatches.length) > i; i++) {

            const rawName = nearMatches[i].path.replaceAll(".md", "");
            const shownName = rawName.replaceAll("_", " ");
            elements.push(
              <li key={i}><a onClick={(e) => {

                e.preventDefault();
                inputBox.value = shownName;
                document.activeElement.blur();
                history.push(`/articles/${rawName}`);
                
              }} href={`/articles/${rawName}`}>{shownName}</a></li>
            );

          }

          // Finally, show the matches
          setSearchResults(elements);

        } else {

          setSearchResults(null);

        }

      }

    } catch (err) {

      console.log(`Couldn't search pages: ${err.message}`);

    }

  }

  return (
    <header>
      <section>
        <div id={styles["wiki-name"]}>The Showrunners</div>
      </section>
      <form ref={searchBox} id={styles["search-box"]}>
        <input type="text" onInput={userSearching} placeholder="Search for or create a page..." />
        <ul ref={searchResultsRef} id={styles["search-results"]}>
          {searchResults}
        </ul>
      </form>
      <section>
        {userCache && userCache._id ? (
          <button onClick={() => history.push("/preferences")} id={styles["account-button"]} style={{
            backgroundImage: `url(${userCache.avatar_url})`,
            backgroundSize: "cover"
          }}></button>
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
  history: PropTypes.object
};

export default Header;