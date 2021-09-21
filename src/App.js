import "./styles/global.css";
import Article from "./comps/Article";
import Header from "./comps/Header";
import Login from "./comps/Login";
import {Switch, Route, BrowserRouter as Router, useParams, Redirect, useLocation} from "react-router-dom";
import { useState, React, useEffect } from "react";

function App() {

  const [articleName, setArticleName] = useState();
  const [page, setPage] = useState(null);
  const [callbackCode, setCallbackCode] = useState();
  const [pageType, setPageType] = useState();
  const [internalName, setInternalName] = useState();

  function PrepareArticle() {
    
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
    setPageType(0);
    return null;

  }

  function Callback() {

    // Check if we have a code
    const code = new URLSearchParams(useLocation().search).get("code");
    if (code) {

      // We need to use async, so let's pass the code to the effect
      setCallbackCode(code);
      setPageType(1);
      return null;

    }

    // We don't have a code, so let's take it back
    return <Redirect to="/" />;

  }

  useEffect(async () => {

    try {

      switch (pageType) {

        // Article
        case 0: {

          // Get the cookie
          const value = `; ${document.cookie}`;
          const parts = value.split("; access_token=");
          const token = parts.length === 2 && parts.pop().split(";")[0];

          // Check if we ran into any problems 
          const articleResponse = await fetch("https://api.wiki.showrunners.net/api/contents/articles/" + internalName + ".md", {
            headers: {
              token: token
            }
          });

          const articleJson = articleResponse.ok ? await articleResponse.json() : {};

          switch (articleResponse.status) {

            case 401:
              setPage(<Redirect to="/login" />);
              return;

            case 404:
            case 200:
              setPage(<>
                <Header />
                <Article name={articleName} data={articleJson} />
              </>);
              break;

            default:
              break;

          }
          break;

        }

        // Callback
        case 1: {

          try {

            // Send the code to the server and get a token
            const tokenResponse = await fetch("https://api.wiki.showrunners.net/api/callback?code=" + callbackCode, {
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
          <PrepareArticle />{page}
        </Route>
      </Switch>
    </Router>
  );

}

export default App;
