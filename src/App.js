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
import WorldCreator from "./components/library/creator/WorldCreator";
import AbuseReporter from "./components/AbuseReporter";
import ArtViewer from "./components/library/viewer/ArtViewer";
import Popup from "./components/Popup";
import Authenticator from "./components/Authenticator";
import LiveNotification from "./components/LiveNotification";
import ContentWarning from "./components/ContentWarning";
import BlogPost from "./components/BlogPost";
import Settings from "./components/Settings";

const artRegex = /^\/(?<username>[^/]+)\/art\/(?<slug>[^/]+)\/?$/gm;
const maintenance = false;
const creators = {
  "report-abuse": AbuseReporter,
  "create-art": ArtCreator,
  "create-literature": LiteratureCreator,
  "create-character": CharacterCreator,
  "create-world": WorldCreator
};

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
  const [searchParams] = useSearchParams();
  let [currentUser, setCurrentUser] = useState({});
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

  // Check if we want to create something
  action = searchParams.get("action");
  pathname = location.pathname;
  useEffect(async () => {

    let mounted = true;
    let component = art ? {...creators, "edit-art": ArtCreator}[action] : creators[action];
    let element;
    let groups;
    let cUser;
    const token = document.cookie.match("(^|;)\\s*token\\s*=\\s*([^;]+)")?.pop() || null;

    if (token && !currentUser.id) {

      const response = await fetch(`${process.env.RAZZLE_API_DEV}accounts/user`, {
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

        const artResponse = await fetch(`${process.env.RAZZLE_API_DEV}contents/art/${username}/${slug}`, {headers: token ? {token} : {}});
        const art = await artResponse.json();

        if (mounted) {

          if (artResponse.ok) {

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
      
    } else if (!groups) {

      setArt();

    }

    if (mounted) {

      // Check if we need a popup open
      if (component) {

        element = React.createElement(component, {
          currentUser,
          art,
          addNotification,
          updated: () => {

            setArt();
            setUpdated(true);

          },
          refreshArt: () => setArt({refresh: true}),
          setPopupSettings: ({title, warnUnfinished, onClose}) => {

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

  }, [action, pathname, document.cookie, art]);

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
        <ArtViewer 
          notify={addNotification} 
          currentUser={currentUser} 
          open={art ? true : false} 
          art={art}
          artRegex={artRegex}
          artDeleted={() => setUpdated(true)}
          confirmContentWarning={(warningText) => setContentWarning(warningText)}
          onClose={() => {

            setLocation(location);
            setArtViewerOpen(false);

          }} 
        />
      )}
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
          "/:username", "/:username/:tab/:id", "/:username/:tab", "/:username/:tab/:id", "/:username/:tab/:id/:subtab"
        ].map((path, index) => {
          
          return <Route key={index} path={path} element={(
            <Profile updated={updated} shownLocation={shownLocation} setLocation={setLocation} currentUser={currentUser} notify={addNotification} />
          )} />;

        })}
        <Route path={"/:username/blog/:slug"} element={<BlogPost shownLocation={shownLocation} setLocation={setLocation} currentUser={currentUser} addNotification={addNotification} />} />
        {["/settings", "/:username/:category/:slug/settings/:tab"].map((path, index) => {
          
          return <Route key={index} path={path} element={<Settings currentUser={currentUser} shownLocation={shownLocation} setLocation={setLocation} />} />;

        })}
        <Route path={"/settings/:tab"} element={<Settings currentUser={currentUser} shownLocation={shownLocation} setLocation={setLocation} setCurrentUser={setCurrentUser} />} />
      </Routes>
    </>
  ) : null;

}

App.propTypes = {
  history: PropTypes.object
};