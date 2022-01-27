import React, { useEffect, useState } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";
import Home from "./components/Home";
import "./styles/global.css";
import PropTypes from "prop-types";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Maintenance from "./components/Maintenance";
import ArtCreator from "./components/library/creator/ArtCreator";
import LiteratureCreator from "./components/library/creator/LiteratureCreator";
import CharacterCreator from "./components/library/creator/CharacterCreator";
import TeamCreator from "./components/library/creator/TeamCreator";
import WorldCreator from "./components/library/creator/WorldCreator";
import AbuseReporter from "./components/AbuseReporter";

const maintenance = false;

export default function App() {

  const creators = {
    "report-abuse": AbuseReporter,
    "create-art": ArtCreator,
    "create-literature": LiteratureCreator,
    "create-character": CharacterCreator,
    "create-team": TeamCreator,
    "create-world": WorldCreator
  };
  const [searchParams] = useSearchParams();
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
    transparentHeader: useState(false),
    createContent: useState(React.Fragment)
  };
  let action;

  // Check if the website is under maintenance
  if (maintenance) return <Maintenance />;

  // Check if they want to create something
  action = searchParams.get("action");
  useEffect(() => {

    let component = creators[action];
    if (state.createContent[0].type === component) return;
    state.createContent[1](component ? React.createElement(component, {}, null) : React.Fragment);

  }, [state.createContent[0], action]);

  // Listen for theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => state.systemDark[1](event.matches));

  return (
    <>
      {state.createContent[0]}
      <Header userCache={state.userCache[0]} token={state.token[0]} theme={state.theme[0]} systemDark={state.systemDark[0]} />
      <Routes>
        <Route path="/" element={<Home theme={state.theme[0]} />} />
        <Route path={"/:username"} element={<Profile />} />
        <Route path={"/:username/:tab"} element={<Profile />} />
        <Route path={"/:username/:tab/:id"} element={<Profile />} />
      </Routes>
    </>
  );

}

App.propTypes = {
  history: PropTypes.object
};