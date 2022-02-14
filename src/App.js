import React, { useEffect, useState } from "react";
import { Route, Routes, useSearchParams, useNavigate, useLocation } from "react-router-dom";
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
import Popup from "./components/Popup";
import Authenticator from "./components/Authenticator";
import LiveNotification from "./components/LiveNotification";

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
  const [theme, setTheme] = useState((themeParts.length === 2 && themeParts.pop().split(";")[0]) || 1);
  const [systemDark, setSystemDark] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [popupChildren, setPopupChildren] = useState(null);
  const [popupTitle, setPopupTitle] = useState();
  const [popupWarnUnfinished, setPopupWarnUnfinished] = useState(false);
  const [uploaderName, setUploaderName] = useState();
  const [artSlug, setArtSlug] = useState();
  const [signInOpen, setSignInOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [shownLocation, setLocation] = useState(location);
  const [currentUser, setCurrentUser] = useState({});
  const [notifications, setNotifications] = useState([]);
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
      setArtSlug(groups.id);
      
    } else {

      setUploaderName();
      setArtSlug();

    }

    // Check if we need a popup open
    if (component) {

      element = React.createElement(component, {
        currentUser,
        setPopupSettings: ({title, warnUnfinished}) => {

        if (title) {

          setPopupTitle(title);

        }

        if (warnUnfinished) {

          setPopupWarnUnfinished(warnUnfinished);

        }
        
        }
      });

      setPopupChildren(element);

    } else {

      setPopupChildren(null);

    }

    // Check if we need to sign in
    if (pathname === "/signin") {

      setSignInOpen(true);

    } else {

      setSignInOpen(false);

    }

  }, [action, pathname, currentUser]);

  useEffect(async () => {

    const token = document.cookie.match("(^|;)\\s*token\\s*=\\s*([^;]+)")?.pop() || null;

    if (token) {

      const response = await fetch(`${process.env.RAZZLE_API_DEV}accounts/user`, {
        headers: {
          token
        }
      });
  
      setCurrentUser(response.ok ? {
        ...await response.json(),
        token
      } : {});

    }

  }, [document.cookie]);

  function addNotification(config) {

    setNotifications(notifications => {
      
      const notification = (
        <LiveNotification 
          title={config.title} 
          timeout={config.timeout} 
          key={notifications.length}
          onClose={() => {

            // Remove the notification from the list
            setNotifications(notifications => notifications.filter((notificationB) => notification !== notificationB));
      
          }}
        >{config.children}</LiveNotification>
      );
      
      return [...notifications, notification];
    
    });

  }

  // Listen for theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => setSystemDark(event.matches));

  return (
    <>
      <Popup notify={addNotification} open={signInOpen}>
        <Authenticator onSuccess={() => navigate(shownLocation.pathname, {replace: true})} />
      </Popup>
      <Popup notify={addNotification} title={popupTitle} open={popupChildren !== null} onClose={() => setPopupChildren(null)} warnUnfinished={popupWarnUnfinished}>
        {popupChildren}
      </Popup>
      <ArtViewer notify={addNotification} currentUser={currentUser} open={artSlug ? true : false} username={uploaderName} slug={artSlug} onClose={(username) => {
        
        navigate(`/${username}/art`);
        setLocation(location);
        setUploaderName();
        setArtSlug();

      }} />
      <Header notify={addNotification} currentUser={currentUser} theme={theme} systemDark={systemDark} setLocation={setLocation} />
      <section id="live-notifications">
        {notifications}
      </section>
      <Routes location={shownLocation}>
        <Route path={"/"} element={<Home theme={theme} shownLocation={shownLocation} setLocation={setLocation} />} />
        <Route path={"/register"} element={<Home theme={theme} shownLocation={shownLocation} setLocation={setLocation} />} />
        <Route path={"/signin"} element={<Home theme={theme} shownLocation={shownLocation} setLocation={setLocation} />} />
        <Route path={"/library"} element={<Home theme={theme} shownLocation={shownLocation} setLocation={setLocation} />} />
        <Route path={"/library/:category"} element={<Home theme={theme} shownLocation={shownLocation} setLocation={setLocation} />} />
        {["/:username", "/:username/:tab/:id", "/:username/:tab", "/:username/:tab/:id", "/:username/:tab/:id/chapters", "/:username/:tab/:id/characters", "/:username/literature/:id/chapters/:chapter"].map((path, index) => {
          
          return <Route key={index} path={path} element={<Profile shownLocation={shownLocation} setLocation={setLocation} currentUser={currentUser} notify={addNotification} />} />;

        })}
      </Routes>
    </>
  );

}

App.propTypes = {
  history: PropTypes.object
};