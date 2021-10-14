import React, { useState } from "react";
import "../styles/header.css";
import MenuOverlay from "./MenuOverlay";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

let cachedUserInfo;
let cachedResults;

function Header(props) {

  const [overlayVisible, setOverlayVisibility] = useState(false);
  const [searchResults, setSearchResults] = useState();

  function ToggleOverlayVisibility() {

    setOverlayVisibility(!overlayVisible);

  }
  
  function CloseSearchResults(articleName) {
    
    document.getElementById("search-results").classList.remove("block");
    if (articleName) document.getElementById("search-box").firstChild.value = articleName;

  }

  async function UserSearching() {

    const inputBox = document.getElementById("search-box").firstChild;
    
    // Get all article names
    const articleResponse = !cachedResults && await fetch("https://api.wiki.showrunners.net/api/articles", {
      headers: {
        token: props.token
      }
    });
    const articleJson = cachedResults || (articleResponse.ok && await articleResponse.json());

    if (articleJson) {

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
            <li key={i}><Link onClick={() => CloseSearchResults(shownName)} to={`/articles/${rawName}`}>{shownName}</Link></li>
          );

        }

        // Finally, show the matches
        setSearchResults(elements);

        // Show the results
        document.getElementById("search-results").classList.add("block");

      } else {

        setSearchResults();

      }

    }

  }

  cachedUserInfo = props.userInfo || cachedUserInfo;

  return (
    <>
      <MenuOverlay visible={overlayVisible} />
      <header>
        <section>
          <button id="menu-button" onClick={ToggleOverlayVisibility}>
            <img src="/icons8-menu.svg" />
          </button>
          <div id="wiki-name">The Showrunners</div>
        </section>
        <form id="search-box">
          <input type="text" onInput={UserSearching} placeholder="Search for a page..." />
          <ul id="search-results">
            {searchResults}
          </ul>
        </form>
        <section>
          <img id="search-icon" src="/Search-icon.svg" />
          {props.userInfo || cachedUserInfo ? (
            <button id="account-button" style={{
              backgroundImage: `url(${props.userInfo ? props.userInfo.avatar_url : cachedUserInfo.avatar_url})`,
              backgroundSize: "cover"
            }}></button>
          ) : null}
        </section>
      </header>
    </>
  );

}

Header.propTypes = {
  userInfo: PropTypes.object,
  token: PropTypes.string
};

export default Header;