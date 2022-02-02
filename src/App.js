import React, { useEffect, useState } from "react";
import { Route, Routes, useSearchParams, useNavigate } from "react-router-dom";
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
import ArtViewer from "./components/library/viewer/ArtViewer";
import ChapterViewer from "./components/library/viewer/ChapterViewer";
import Popup from "./components/Popup";

const artRegex = /^\/(?<uploaderName>[^/]+)\/art\/(?<id>[^/]+)\/?$/gm;
const maintenance = false;
const creators = {
  "report-abuse": AbuseReporter,
  "create-art": ArtCreator,
  "create-literature": LiteratureCreator,
  "create-character": CharacterCreator,
  "create-team": TeamCreator,
  "create-world": WorldCreator
};

export default function App() {

  const [searchParams] = useSearchParams();
  const value = `; ${document.cookie}`;
  const themeParts = value.split("; theme=");
  
  // States
  const [userData, setUserData] = useState({});
  const [theme, setTheme] = useState((themeParts.length === 2 && themeParts.pop().split(";")[0]) || 1);
  const [systemDark, setSystemDark] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [popupChildren, setPopupChildren] = useState(null);
  const [popupTitle, setPopupTitle] = useState();
  const [popupWarnUnfinished, setPopupWarnUnfinished] = useState(false);
  const [uploaderName, setUploaderName] = useState();
  const [artId, setArtId] = useState();
  const [signInOpen, setSignInOpen] = useState(false);
  let matchedPath;
  let action;
  let pathname;

  // Check if the website is under maintenance
  if (maintenance) return <Maintenance />;

  // Check if we want to create something
  action = searchParams.get("action");
  pathname = location.pathname;
  useEffect(() => {

    let component = creators[action];
    let element;
    let groups;

    // Check if we need the art viewer open
    matchedPath = [...pathname.matchAll(artRegex)];
    groups = matchedPath[0] && matchedPath[0].groups;
    if (groups) {

      // Save the uploader name and id
      setUploaderName(groups.uploaderName);
      setArtId(groups.id);
      
    } else {

      setUploaderName();
      setArtId();

    }

    // Check if we need a popup open
    if (component) {

      element = React.createElement(component, {setPopupSettings: ({title, warnUnfinished}) => {

        if (title) {

          setPopupTitle(title);

        }

        if (warnUnfinished) {

          setPopupWarnUnfinished(warnUnfinished);

        }
        
      }});

      setPopupChildren(element);

    } else {

      setPopupChildren(null);

    }

  }, [action, pathname]);

  const navigate = useNavigate();

  // Listen for theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => setSystemDark(event.matches));

  return (
    <>
      <Popup title={popupTitle} open={popupChildren !== null} onClose={() => setPopupChildren(null)} warnUnfinished={popupWarnUnfinished}>
        {popupChildren}
      </Popup>
      <ArtViewer open={artId ? true : false} username={uploaderName} id={artId} onClose={(username) => {
        
        navigate(`/${username}/art`);
        setUploaderName();
        setArtId();

      }} />
      <Header userData={userData} theme={theme} systemDark={systemDark} onSignInClick={() => setSignInOpen(true)} />
      <Routes>
        <Route path={"/"} element={<Home theme={theme} />} />
        <Route path={"/register"} element={<Home theme={theme} />} />
        <Route path={"/signin"} element={<Home theme={theme} />} />
        <Route path={"/library"} element={<Home theme={theme} />} />
        <Route path={"/library/:category"} element={<Home theme={theme} />} />
        <Route path={"/:username"} element={<Profile />} />
        <Route path={"/:username/art/:id"} element={<Profile />} />
        <Route path={"/:username/:tab"} element={<Profile />} />
        <Route path={"/:username/:tab/:id"} element={<Profile />} />
        <Route path={"/:username/:tab/:id/chapters"} element={<Profile />} />
        <Route path={"/:username/:tab/:id/characters"} element={<Profile />} />
        <Route path={"/:username/literature/:id/chapters/:chapter"} element={<ChapterViewer />} />
      </Routes>
    </>
  );

}

App.propTypes = {
  history: PropTypes.object
};