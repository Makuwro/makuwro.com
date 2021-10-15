import React from "react";
import "../styles/header.css";
import MenuOverlay from "./MenuOverlay";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

let cachedResults;

class Header extends React.Component {

  constructor() {

    // Get React's properties
    super();

    // Bind functions
    this.userSearching = this.userSearching.bind(this);
    this.closeSearchResults = this.closeSearchResults.bind(this);
    this.toggleOverlayVisibility = this.toggleOverlayVisibility.bind(this);

    // Set initial state
    this.state = {
      overlayVisible: false,
      searchResults: null
    };

  }

  async componentDidMount() {

    const value = `; ${document.cookie}`;
    const parts = value.split("; access_token=");
    const token = parts.length === 2 && parts.pop().split(";")[0];
    this.setState({token: token});

    if (token && !this.state.userCache) {

      // Get current user info
      const userResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: "Bearer " + token
        }
      });
      if (userResponse.ok) this.setState({userCache: await userResponse.json()});

    }

  }

  toggleOverlayVisibility() {

    this.setState((state) => ({overlayVisible: !state.overlayVisible}));

  }
  
  closeSearchResults(articleName) {
    
    document.getElementById("search-results").classList.remove("block");
    if (articleName) document.getElementById("search-box").firstChild.value = articleName;

  }

  async userSearching() {

    const inputBox = document.getElementById("search-box").firstChild;
    
    // Get all article names
    const articleResponse = !cachedResults && await fetch("https://api.wiki.showrunners.net/api/articles", {
      headers: {
        token: this.state.token
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
            <li key={i}><Link onClick={() => this.closeSearchResults(shownName)} to={`/articles/${rawName}`}>{shownName}</Link></li>
          );

        }

        // Finally, show the matches
        this.setState({searchResults: elements});

        // Show the results
        document.getElementById("search-results").classList.add("block");

      } else {

        this.setState({searchResults: null});

      }

    }

  }

  render() {

    return (
      <>
        <MenuOverlay visible={this.state.overlayVisible} />
        <header>
          <section>
            <button id="menu-button" onClick={this.toggleOverlayVisibility}>
              <img src="/icons8-menu.svg" />
            </button>
            <div id="wiki-name">The Showrunners</div>
          </section>
          <form id="search-box">
            <input type="text" onInput={this.userSearching} placeholder="Search for a page..." />
            <ul id="search-results">
              {this.state.searchResults}
            </ul>
          </form>
          <section>
            <img id="search-icon" src="/Search-icon.svg" />
            {this.state.userCache ? (
              <button id="account-button" style={{
                backgroundImage: `url(${this.props.userInfo ? this.props.userInfo.avatar_url : this.state.userCache.avatar_url})`,
                backgroundSize: "cover"
              }}></button>
            ) : null}
          </section>
        </header>
      </>
    );

  }

}

Header.propTypes = {
  userInfo: PropTypes.object,
  token: PropTypes.string
};

export default Header;