import "./styles/global.css";
import Article from "./comps/Article";
import Header from "./comps/Header";
import MenuOverlay from "./comps/MenuOverlay";
import Login from "./comps/Login";
import {Switch, Route, BrowserRouter as Router, useParams, Redirect} from "react-router-dom";
import { useState, React } from "react";

function App() {

  const [articleName, setArticleName] = useState();

  function PrepareArticle() {
    
    // Make sure we're using underscores instead of spaces
    const {internalName} = useParams();
    const underscoreInternalName = internalName.replaceAll(" ", "_");
    if (internalName !== underscoreInternalName) {

      return <Redirect to={"/articles/" + underscoreInternalName} />;

    }

    // Get the article content


    // Show the article name
    const displayName = underscoreInternalName.replaceAll("_", " ");
    setArticleName(displayName);
    document.title = displayName + " - The Showrunners Wiki";

    return null;

  }

  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          <Header />
          <Login />
        </Route>
        <Route exact path="/articles/:internalName">
          <PrepareArticle />
          <MenuOverlay />
          <Header />
          <Article name={articleName} contributors={["Christian Toney", "coin"]} />
        </Route>
      </Switch>
    </Router>
  );

}

export default App;
