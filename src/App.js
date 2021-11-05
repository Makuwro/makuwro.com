import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import "./styles/global.css";
import Article from "./components/Article";
import Preferences from "./components/Preferences";
import Login from "./components/login";
import Registration from "./components/Registration";
import Settings from "./components/Settings";

class App extends React.Component {

  constructor() {

    super();

    const value = `; ${document.cookie}`;
    const parts = value.split("; token=");
    const token = parts.length === 2 && parts.pop().split(";")[0];

    this.state = {
      userCache: {},
      userDataObtained: false,
      token: token || undefined
    };

  }

  async componentDidMount() {

    const {token, userCache} = this.state;
    if (token && !userCache.id) {

      try {

        // Get current user info
        const userResponse = await fetch(`${process.env.RAZZLE_WIKI_SERVER}/accounts/me`, {
          headers: {
            token: token
          }
        });
        const jsonResponse = await userResponse.json();
        if (userResponse.ok) this.setState({
          userCache: jsonResponse,
          userDataObtained: true
        });

      } catch (err) {

        console.log(`Couldn't get user info: ${err.message}`);

      }

    }

  }

  render() {

    return (
      <Switch>
        <Route exact path="/">
          <Home {...this.state} />
        </Route>
        <Route exact path={["/articles", "/articles/:name", "/categories", "/categories/:name", "/templates", "/templates/:name"]} render={(props) => (
          <Article {...props} {...this.state} />
        )} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/preferences">
          <Preferences {...this.state} />
        </Route>
        <Route exact path="/register" component={Registration} />
        <Route exact path={["/settings", "/settings/:menu"]} render={(props) => (
          <Settings {...props} {...this.state} />
        )} />
      </Switch>
    );

  }

}

export default App;
