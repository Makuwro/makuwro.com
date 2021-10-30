import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import "./styles/global.css";
import Article from "./components/Article";
import Preferences from "./components/Preferences";
import Callback from "./components/Callback";
import Login from "./components/login";
import UserRegistration from "./components/UserRegistration";
import Settings from "./components/Settings";

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/articles/:name" component={Article} />
    <Route exact path="/callback" component={Callback} />
    <Route exact path="/categories/:name" component={Article} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/preferences" component={Preferences} />
    <Route exact path="/register" component={UserRegistration} />
    <Route exact path="/settings" component={Settings} />
    <Route exact path="/settings/:menu" component={Settings} />
    <Route exact path="/templates/:name" component={Article} />
  </Switch>
);

export default App;
