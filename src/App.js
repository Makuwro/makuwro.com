import "./styles/global.css";
import Article from "./comps/Article";
import Header from "./comps/Header";
import Login from "./comps/Login";
import {Switch, Route, BrowserRouter as Router, useParams, Redirect, useLocation} from "react-router-dom";
import { useState, React, useEffect } from "react";
import Home from "./comps/Home";
import PropTypes from "prop-types";

const wikiServer = process.env.REACT_APP_WIKI_SERVER;
const pageContentCache = {};
let userCache;

function App() {

  const [articleName, setArticleName] = useState();
  const [page, setPage] = useState(null);
  const [callbackCode, setCallbackCode] = useState();
  const [pageType, setPageType] = useState();
  const [internalName, setInternalName] = useState();

  function PreparePage(props) {
    
    // Make sure we're using underscores instead of spaces
    const {internalName} = useParams();
    setInternalName(internalName);
    const underscoreInternalName = internalName.replaceAll(" ", "_");
    if (internalName !== underscoreInternalName) {

      return <Redirect to={"/articles/" + underscoreInternalName} />;

    }

    // Show the article name
    const displayName = underscoreInternalName.replaceAll("_", " ");
    setArticleName(displayName);
    document.title = displayName + " - The Showrunners Wiki";

    // Set page type to article
    setPageType(props.type);
    return null;

  }

  PreparePage.propTypes = {
    type: PropTypes.string
  };

  function Callback() {

    // Check if we have a code
    const code = new URLSearchParams(useLocation().search).get("code");
    if (code) {

      // We need to use async, so let's pass the code to the effect
      setCallbackCode(code);
      setPageType("callback");
      return null;

    }

    // We don't have a code, so let's take it back
    return <Redirect to="/" />;

  }

  useEffect(async () => {

    try {

      switch (pageType) {

        case "category":
        case "article": {

          // Get the cookie
          const value = `; ${document.cookie}`;
          const parts = value.split("; access_token=");
          const token = parts.length === 2 && parts.pop().split(";")[0];

          // Check if we ran into any problems
          const cachedJson = pageContentCache[pageType + internalName];
          const pageResponse = cachedJson ? {status: 200} : await fetch(wikiServer + "/api/contents/" + (pageType === "article" ? "articles/" + internalName + ".md" : "categories.json"), {
            headers: {
              token: token
            }
          });
          const articleJson = cachedJson || (pageResponse.ok ? await pageResponse.json() : {});

          switch (pageResponse.status) {

            case 401:
              setPage(<Redirect to={`/login?redirect=/articles/${internalName}`} />);
              return;

            case 404:
            case 200: {
            
              // Save the content to lower the chance we get rate-limited
              pageContentCache[pageType + internalName] = articleJson;

              // Prepare category page, if necessary
              const allCategories = pageType === "category" && JSON.parse(articleJson.content);
              const category = allCategories && allCategories[articleName];
              articleJson.content = allCategories ? (category ? `Below are articles in the "${articleName}" category:\n` : "") : articleJson.content;
              if (category) {

                for (const [articleName, inCategory] of Object.entries(category)) {

                  articleJson.content = articleJson.content + (inCategory ? `* [${articleName}](${articleName})\n` : "");

                }

              }

              // Get current user info
              const userResponse = !userCache && await fetch("https://api.github.com/user", {
                headers: {
                  Authorization: "Bearer " + token
                }
              });
              userCache = userCache || (userResponse.ok && await userResponse.json());

              setPage(<>
                <Header token={token} userInfo={userCache} />
                <Article name={articleName} data={articleJson} />
              </>);
              break;
              
            }

            default:
              break;

          }
          break;

        }

        case "callback": {

          try {

            // Send the code to the server and get a token
            const tokenResponse = await fetch(wikiServer + "/api/callback?code=" + callbackCode, {
              method: "PUT"
            });
            const jsonResponse = await tokenResponse.json();

            switch (tokenResponse.status) {

              case 400:
                break;

              case 200:

                // Save the token as a cookie
                document.cookie = `access_token=${jsonResponse.access_token};expires_in=${jsonResponse.expires_in};refresh_token=${jsonResponse.refresh_token};refresh_token_expires_in=${jsonResponse.refresh_token_expires_in};token_type=${jsonResponse.token_type}; path=/`;

                // Close the window
                window.close();
                break;

              default:
                break;

            }

          } catch (err) {

            setPage(<Redirect to="/login" />);

          }

          break;

        }

        default:
          break;

      }

    } catch (err) {

      return <Redirect to="/login" />;

    }

  }, [articleName, pageType]);

  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          <Header />
          <Login />
        </Route>
        <Route exact path="/callback">
          <Callback />
        </Route>
        <Route exact path="/articles/:internalName">
          <PreparePage type="article" />{page}
        </Route>
        <Route exact path="/articles">
          <Redirect to="/" />
        </Route>
        <Route exact path="/categories/:internalName">
          <PreparePage type="category" />{page}
        </Route>
        <Route exact path="/categories">
          <Redirect to="/" />
        </Route>
        <Route exact path="/">
          <Header />
          <Home />
        </Route>
      </Switch>
    </Router>
  );

}

export default App;
