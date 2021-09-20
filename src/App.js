import "./styles/global.css";
import Article from "./comps/Article";
import Header from "./comps/Header";
import Login from "./comps/Login";
import {Switch, Route, BrowserRouter as Router, useParams, Redirect} from "react-router-dom";
import { useState, React, useEffect } from "react";

function App() {

  const [articleName, setArticleName] = useState();
  const [article, setArticle] = useState(null);

  function PrepareArticle() {
    
    // Make sure we're using underscores instead of spaces
    const {internalName} = useParams();
    const underscoreInternalName = internalName.replaceAll(" ", "_");
    if (internalName !== underscoreInternalName) {

      return <Redirect to={"/articles/" + underscoreInternalName} />;

    }

    // Show the article name
    const displayName = underscoreInternalName.replaceAll("_", " ");
    setArticleName(displayName);
    document.title = displayName + " - The Showrunners Wiki";

    return null;

  }

  useEffect(async () => {

    try {

      // Get the article info
      //setArticleData({content: "Test"});
      //let articleInfo = await fetch("https://efoifhu");

      const articleData = {content: "# Description\n## Role in the story\n**Your Mom**, also known as *The Monster of the Weekend*, is here. Right behind you. **LOOK OUT!!**\n# Did I scare you?\nJuuuust kidding. I wouldn't actually do that...\n\nOr would I?"};
      setArticle(<>
        <Header />
        <Article name={articleName} data={articleData} />
      </>);

    } catch (err) {

      return <Redirect to="/login" />;

    }

  }, [articleName]);

  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          <Header />
          <Login />
        </Route>
        <Route exact path="/articles/:internalName">
          <PrepareArticle />{article}
        </Route>
      </Switch>
    </Router>
  );

}

export default App;
