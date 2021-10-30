import React from "react";
import styles from "../styles/Header.module.css";
import MenuOverlay from "./MenuOverlay";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";

let cachedResults;

class Header extends React.Component {

  constructor() {

    // Get React's properties
    super();

    // Bind functions
    this.userSearching = this.userSearching.bind(this);
    this.toggleOverlayVisibility = this.toggleOverlayVisibility.bind(this);

    // Create refs
    this.searchBox = React.createRef();
    this.searchResults = React.createRef();

    // Set initial state
    this.state = {
      overlayVisible: false,
      searchResults: null,
      userInfo: null
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

  async userSearching() {

    const inputBox = this.searchBox.current.firstChild;
    
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
            <li key={i}><a onClick={(e) => {

              e.preventDefault();
              inputBox.value = shownName;
              document.activeElement.blur();
              this.props.history.push(`/articles/${rawName}`);
              
            }} href={`/articles/${rawName}`}>{shownName}</a></li>
          );

        }

        // Finally, show the matches
        this.setState({searchResults: elements});

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
            <button id={styles["menu-button"]} onClick={this.toggleOverlayVisibility}>
              <img src="/icons8-menu.svg" />
            </button>
            <div id={styles["wiki-name"]}>The Showrunners</div>
          </section>
          <form ref={this.searchBox} id={styles["search-box"]}>
            <input type="text" onInput={this.userSearching} placeholder="Search for a page..." />
            <ul ref={this.searchResults} id={styles["search-results"]}>
              {this.state.searchResults}
            </ul>
          </form>
          <section>
            {this.state.userCache ? (
              <button onClick={() => this.history.push("/preferences")} id={styles["account-button"]} style={{
                backgroundImage: `url(${this.state.userCache.avatar_url})`,
                backgroundSize: "cover"
              }}></button>
            ) : (
              <Link to="/login" id={styles["login-button"]}>
                Login
              </Link>
            )}
          </section>
        </header>
      </>
    );

  }

}

Header.propTypes = {
  userInfo: PropTypes.object,
  token: PropTypes.string,
  articleContainer: PropTypes.any,
  history: PropTypes.object
};

export default withRouter(Header);