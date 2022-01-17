import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import "./styles/global.css";
import Login from "./components/login";
import Registration from "./components/Registration";
import PropTypes from "prop-types";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Maintenance from "./components/Maintenance";
import Popup from "./components/Popup";

const maintenance = false;

export default function App() {

  const value = `; ${document.cookie}`;
  const tokenParts = value.split("; token=");
  const token = tokenParts.length === 2 && tokenParts.pop().split(";")[0];
  const themeParts = value.split("; theme=");
  const theme = themeParts.length === 2 && themeParts.pop().split(";")[0];
  const state = {
    userCache: useState({}),
    userDataObtained: useState(false),
    token: useState(token || ""),
    redirect: useState(),
    theme: useState(theme ? parseInt(theme, 10) : 1),
    systemDark: useState(window.matchMedia("(prefers-color-scheme: dark)").matches),
    transparentHeader: useState(false)
  };

  // Check if the website is under maintenance
  if (maintenance) return <Maintenance />;

  // Check if we're logged in
  useEffect(async () => {

    const {token, userCache, redirect} = state;
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

  }, [state.token[0]]);

  // Listen for theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => state.systemDark[1](event.matches));

  return (
    <>
      <Popup />
      <Header userCache={state.userCache[0]} token={state.token[0]} theme={state.theme[0]} systemDark={state.systemDark[0]} />
      <Routes>
        <Route path="/" element={<Home theme={state.theme[0]} />} />
        <Route path="/login" element={<Login setToken={(token, redirect) => {
          
          state.token[1](token);
          state.redirect[1](redirect);

        }} />} />
        <Route path="/register" element={<Registration />} />
        <Route path={"/:username"} element={<Profile />} />
        <Route path={"/:username/:tab"} element={<Profile />} />
      </Routes>
    </>
  );

}

App.propTypes = {
  history: PropTypes.object
};