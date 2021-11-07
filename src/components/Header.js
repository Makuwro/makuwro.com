import React from "react";
import styles from "../styles/Header.module.css";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";

class Header extends React.Component {

  constructor(props) {

    super(props);
    this.userSearching = this.userSearching.bind(this);

    // Set initial state
    this.state = {
      searchResults: null,
      query: ""
    };
    

  }

  async userSearching() {
    
    try {

      // Get all article names
      const articleResponse = !this.state.cachedResults && await fetch(`${process.env.RAZZLE_WIKI_SERVER}/pages`, {
        headers: {
          token: this.props.token
        }
      });
      const articleJson = this.state.cachedResults || (articleResponse.ok && await articleResponse.json());

      const {query} = this.state;
      if (query && articleJson) {

        this.setState({cachedResults: articleJson}, () => {

          // Search through articles to find those that start with our query
          const searchRegex = new RegExp(`^${query.replaceAll(" ", "_")}`, "gi");
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
                  this.props.history.push(`/articles/${name}`);
                  
                }} href={`/articles/${name}`}>{spacedName}</a></li>
              );

            }

            // Finally, show the matches
            this.setState({searchResults: elements});

          }

        });

      } else {

        this.setState({searchResults: null});

      }

    } catch (err) {

      console.log(`Couldn't search pages: ${err.message}`);

    }

  }

  componentDidUpdate(oldProps, oldState) {

    if (oldState.cachedResults === this.state.cachedResults && oldState.query === this.state.query) return;
    this.userSearching();

  }

  render() {

    const {userCache} = this.props;
    return (
      <header>
        <section>
          <div id={styles["wiki-name"]}>The Showrunners</div>
        </section>
        <form id={styles["search-box"]}>
          <input type="text" onInput={(e) => this.setState({query: e.target.value})} placeholder="Search for or create a page..." />
          <ul style={!this.state.searchResults ? {display: "none"} : null} id={styles["search-results"]}>
            {this.state.searchResults}
          </ul>
        </form>
        <section>
          {userCache && userCache._id ? (
            <>
              <button>
                Share
              </button>
              <button onClick={() => this.props.history.push("/preferences")} id={styles["account-button"]} style={{
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

}

Header.propTypes = {
  userCache: PropTypes.object,
  token: PropTypes.string,
  articleContainer: PropTypes.any,
  history: PropTypes.object
};

export default withRouter(Header);