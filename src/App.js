import React, { useEffect, useState } from "react";
import { Route, Routes, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import Home from "./components/Home";
import "./styles/global.css";
import PropTypes from "prop-types";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Maintenance from "./components/Maintenance";
import Art from "./components/library/Art";
import Popup from "./components/Popup";
import Authenticator from "./components/Authenticator";
import LiveNotification from "./components/LiveNotification";
import ContentWarning from "./components/ContentWarning";
import Literature from "./components/library/Literature";
import Settings from "./components/Settings";
import Submitter from "./components/library/Submitter";
import OfflineServer from "./components/errors/OfflineServer";
import OfflineClient from "./components/errors/OfflineClient";
import GameOverError from "./components/errors/GameOverError";

const artRegex = /^\/(?<username>[^/]+)\/art\/(?<slug>[^/]+)\/?$/gm;
const maintenance = false;
const mode = "dev";
const api = {
  dev: "http://localhost:3001/",
  prod: "https://api.makuwro.com/"
}[mode];

export default function App() {
  
  // States
  const [systemDark, setSystemDark] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [popupChildren, setPopupChildren] = useState(null);
  const [popupTitle, setPopupTitle] = useState();
  const [popupWarnUnfinished, setPopupWarnUnfinished] = useState(false);
  const [art, setArt] = useState();
  const [updated, setUpdated] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const location = useLocation();
  const [shownLocation, setLocation] = useState(location);
  const [notifications, setNotifications] = useState([]);
  const [ready, setReady] = useState(false);
  const [contentWarning, setContentWarning] = useState(null);
  const [artViewerOpen, setArtViewerOpen] = useState(false);
  const [errorComponent, setErrorComponent] = useState(null);
  const [searchParams] = useSearchParams();
  let [currentUser, setCurrentUser] = useState({});
  const [artCache, setArtCache] = useState({});
  const [settingsCache, setSettingsCache] = useState();
  const navigate = useNavigate();
  let matchedPath;
  let action;
  let pathname;

  // Check if the website is under maintenance
  if (maintenance) return <Maintenance />;

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
        >
          {config.children}
        </LiveNotification>
      );
      
      return [...notifications, notification];
    
    });

  }

  useEffect(async () => {

    let mounted = true;

    try {

      // Check if the client is offline
      if (!navigator.onLine) {

        throw new Error("0");

      }

      // Check if the server is available
      const response = await fetch(api);
      if (!response.ok) {

        throw new Error();

      }
      setErrorComponent();
      
    } catch (err) {

      if (mounted) {

        if (err.message === "0") {

          setErrorComponent(<OfflineClient />);

        } else {

          setErrorComponent(<OfflineServer />);

        }

        setReady(true);

      }

    }

    return () => mounted = false;
    
  }, [navigator.onLine]);

  // Check if we want to create something
  action = searchParams.get("action");
  pathname = location.pathname;
  useEffect(async () => {

    if (errorComponent === undefined) {

      let mounted = true;
      let groups;
      let cUser;
      const token = document.cookie.match("(^|;)\\s*token\\s*=\\s*([^;]+)")?.pop() || null;

      if (token && !currentUser.id) {

        const response = await fetch(`${api}accounts/user`, {
          headers: {
            token
          }
        });
    
        cUser = response.ok ? {
          ...await response.json(),
          token
        } : {};

      }

      currentUser = token ? cUser || currentUser : {};

      // Check if we need the art viewer open
      matchedPath = [...pathname.matchAll(artRegex)];
      groups = matchedPath[0] && matchedPath[0].groups;
      if (groups && (!art || art.refresh || (groups.username !== art.owner.username || groups.slug !== art.slug))) {

        const {username, slug} = groups;

        try {

          const directory = `${username}/${slug}`;
          let art = artCache[directory];
          
          if (!art) {

            const artResponse = await fetch(`${api}contents/art/${directory}`, {headers: token ? {token} : {}});
            art = await artResponse.json();
            artCache[directory] = art;

          }

          if (mounted) {

            if (art) {

              setArtViewerOpen(true);
              setArt(art);

            } else {

              addNotification({
                title: "Couldn't get that art",
                children: art.message
              });
              navigate(`/${username}/art`);
              setLocation(location);

            }

          }

        } catch (err) {

          if (mounted) {

            addNotification({
              title: "Couldn't get that art",
              children: err.message
            });
            navigate(`/${username}/art`);
            setLocation(location);

          }

        }
        
      } else if (!groups && mounted) {

        setArt();

      }

      if (mounted) {

        // Check if we need to sign in
        if (pathname === "/signin" || pathname === "/register") {

          setSignInOpen(true);

        } else {

          setSignInOpen(false);

        }

        setUpdated(false);
        setCurrentUser(currentUser);
        setReady(true);

      }

      return () => {
        
        mounted = false;

      };

    }
  
  }, [errorComponent, action, pathname, document.cookie, art]);

  // Listen for theme changes
  useEffect(() => {

    const themeCookie = document.cookie.match("(^|;)\\s*theme\\s*=\\s*([^;]+)")?.pop() || null;
    if (themeCookie && themeCookie !== "0") {

      document.body.classList.add("light");

    } else {

      document.body.classList.remove("light");

    }

  }, [document.cookie]);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => setSystemDark(event.matches));

  return ready ? (
    errorComponent || (
      <>
        <Authenticator open={signInOpen} addNotification={addNotification} shownLocation={shownLocation} currentUser={currentUser} />
        {popupChildren && (
          <Popup notify={addNotification} title={popupTitle} open={popupChildren !== null} onClose={() => {
            
            setPopupChildren(null);
          
          }} warnUnfinished={popupWarnUnfinished}>
            {popupChildren}
          </Popup>
        )}
        {contentWarning && (
          <Popup title="Content warning" open={contentWarning !== null} onClose={() => setContentWarning(null)}>
            <ContentWarning>
              {contentWarning}
            </ContentWarning>
          </Popup>
        )}
        {artViewerOpen && (
          <Art 
            notify={addNotification} 
            currentUser={currentUser}
            art={art}
            artRegex={artRegex}
            artDeleted={() => setUpdated(true)}
            confirmContentWarning={(warningText) => setContentWarning(warningText)}
            onClose={() => {

              navigate(shownLocation);
              setArtViewerOpen(false);

            }} 
          />
        )}
        <Submitter 
          currentUser={currentUser}
        />
        <Header notify={addNotification} currentUser={currentUser} systemDark={systemDark} setLocation={setLocation} />
        <section id="live-notifications">
          {notifications}
        </section>
        <Routes location={shownLocation}>
          {["/", "/register", "/signin"].map((path, index) => {

            return <Route path={path} key={index} element={<Home shownLocation={shownLocation} setLocation={setLocation} />} />;

          })}
          <Route path={"/library"} element={<Home shownLocation={shownLocation} setLocation={setLocation} />} />
          <Route path={"/library/:category"} element={<Home shownLocation={shownLocation} setLocation={setLocation} />} />
          {[
            "/:username", "/:username/:tab", "/:username/:tab/:id", "/:username/:tab/:id", "/:username/:tab/:id/:subtab"
          ].map((path, index) => {
            
            return <Route key={index} path={path} element={(
              <Profile 
                updated={updated} 
                shownLocation={shownLocation} 
                setLocation={setLocation}
                currentUser={currentUser} 
                notify={addNotification} 
                artViewerOpen={artViewerOpen}
                setSettingsCache={setSettingsCache}
              />
            )} />;

          })}
          {["/:username/blog/:slug", "/:username/literature/:literatureSlug/chapters/:chapterSlug", "/:username/worlds/:worldSlug/wiki/:articleSlug"].map((path, index) => (
            <Route 
              key={index} 
              path={path} 
              element={(
                <Literature 
                  shownLocation={shownLocation} 
                  setLocation={setLocation} 
                  currentUser={currentUser} 
                  addNotification={addNotification}
                  setSettingsCache={setSettingsCache}
                />
              )}
            />
          ))}
          {["/settings", "/settings/:tab", "/:username/:category/:slug/settings", "/:username/:category/:slug/settings/:tab"].map((path, index) => (
            <Route 
              key={index} 
              path={path} 
              element={(
                <Settings 
                  currentUser={currentUser} 
                  shownLocation={shownLocation} 
                  setLocation={setLocation} 
                  setCurrentUser={setCurrentUser}
                  settingsCache={settingsCache}
                  setSettingsCache={setSettingsCache}
                />
              )}
            />
          ))}
          <Route path="/gameover" element={<GameOverError />} />
        </Routes>
      </>
    )
  ) : null;

}

App.propTypes = {
  history: PropTypes.object
};