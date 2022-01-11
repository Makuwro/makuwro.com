import React from "react";
import { Route, Switch, withRouter, BrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import "./styles/global.css";
import Article from "./components/Article";
import Preferences from "./components/Preferences";
import Login from "./components/login";
import Registration from "./components/Registration";
import Settings from "./components/Settings";
import ShareManager from "./components/Share";
import PropTypes from "prop-types";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Maintenance from "./components/Maintenance";

const maintenance = false;

class App extends React.Component {

  constructor() {

    super();

    const value = `; ${document.cookie}`;
    const tokenParts = value.split("; token=");
    const token = tokenParts.length === 2 && tokenParts.pop().split(";")[0];
    const themeParts = value.split("; theme=");
    const theme = themeParts.length === 2 && themeParts.pop().split(";")[0];

    this.checkUserInfo = this.checkUserInfo.bind(this);
    this.changeTheme = this.changeTheme.bind(this);

    this.state = {
      userCache: {},
      userDataObtained: false,
      token: token || undefined,
      redirect: undefined,
      theme: theme ? parseInt(theme, 10) : 1,
      systemDark: window.matchMedia("(prefers-color-scheme: dark)").matches
    };

  }

  async checkUserInfo() {

    const {token, userCache, redirect} = this.state;
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
          userDataObtained: true,
          redirect: undefined
        }, () => redirect && this.props.history.replace(redirect));

      } catch (err) {

        console.log(`Couldn't get user info: ${err.message}`);

      }

    }

  }

  async componentDidMount() {

    await this.checkUserInfo();

  }

  async componentDidUpdate(oldProps, oldState) {

    if (oldState.token !== this.state.token) await this.checkUserInfo();

  }

  changeTheme(theme) {

    document.cookie = `theme=${theme}`;
    this.setState({theme: theme});

  }

  render() {

    if (maintenance) return <Maintenance />;

    // Listen for theme changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => this.setState({systemDark: event.matches}));

    return (
      <BrowserRouter>
        <Header {...this.state} />
        <Switch>
          <Route exact path="/">
            <Home {...this.state} />
          </Route>
          <Route exact path={["/articles", "/articles/:name", "/categories", "/categories/:name", "/templates", "/templates/:name"]} render={(props) => (
            <Article {...props} {...this.state} />
          )} />
          <Route exact path="/login">
            <Login setToken={(token, redirect) => this.setState({token: token, redirect: redirect})} />
          </Route>
          <Route exact path="/preferences">
            <Preferences {...this.state} onThemeChange={(theme) => this.changeTheme(theme)} />
          </Route>
          <Route exact path="/register" component={Registration} />
          <Route exact path={["/settings", "/settings/:menu"]} render={(props) => (
            <Settings {...props} {...this.state} />
          )} />
          <Route exact path="/test" component={ShareManager} />
          <Route exact path="/Christian" component={Profile} />
        </Switch>
      </BrowserRouter>
    );

  }

}

App.propTypes = {
  history: PropTypes.object
};

export default withRouter(App);
