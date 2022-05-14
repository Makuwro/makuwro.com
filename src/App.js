import React, { useEffect, useState } from "react";
import { Route, Routes, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import Home from "./components/Home";
import PropTypes from "prop-types";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Maintenance from "./components/Maintenance";
import Art from "./components/library/Art";
import PopupManager from "./components/PopupManager";
import Authenticator from "./components/Authenticator";
import Literature from "./components/library/Literature";
import Settings from "./components/Settings";
import Submitter from "./components/library/Submitter";
import ConnectivityCheck from "./components/ConnectivityCheck";
import "./styles/global.css";
import Search from "./components/Search";

const artRegex = /^\/(?<username>[^/]+)\/art\/(?<slug>[^/]+)\/?$/gm;
const maintenance = false;
const mode = "dev";
const api = {
  dev: "http://localhost:3001/",
  prod: "https://api.makuwro.com/"
}[mode];

export default function App() {

  // Check if the website is under maintenance
  if (maintenance) return <Maintenance />;
  
  // Set up the states
  const [client, setClient] = useState();
  const [ready, setReady] = useState(false);
  const [searchParams] = useSearchParams();
  const [settingsCache, setSettingsCache] = useState();
  const navigate = useNavigate();

  // Check if we want to create something
  const action = searchParams.get("action");
  const location = useLocation();
  const pathname = location.pathname;
  const [art] = useState();
  const [updated, setUpdated] = useState(false);
  const [shownLocation, setLocation] = useState(location);
  const [signInOpen, setSignInOpen] = useState(false);
  const [artViewerOpen, setArtViewerOpen] = useState(false);
  const [criticalError, setCriticalError] = useState();

  useEffect(() => {

    let mounted = true;

    if (client) {

      // Check if we need the art viewer open
      /*
      const matchedPath = [...pathname.matchAll(artRegex)];
      const groups = matchedPath[0] && matchedPath[0].groups;
      if (groups && (!art || art.refresh || (groups.username !== art.owner.username || groups.slug !== art.slug))) {

        const {username, slug} = groups;

        try {

          const directory = `${username}/${slug}`;
          let art = artCache[directory];
          
          if (!art) {

            const artResponse = await fetch(`${api}contents/art/${directory}`, {headers: token ? {token} : {}});
            art = await artResponse.json();
            setArtCache(oldArtCache => {
              
              oldArtCache[directory] = art;
              return oldArtCache;
              
            });

          }

          if (art && mounted) {

            setArtViewerOpen(true);
            setArt(art);

          } else {

            throw new Error("Couldn't get that art");

          }

        } catch ({message}) {

          if (mounted) {

            alert(message);
            navigate(`/${username}/art`);
            setLocation(location);

          }

        }
        
      } else if (!groups && mounted) {

        setArt();

      }
      */

      if (mounted) {

        // Check if we need to sign in
        if (!client?.user && (pathname === "/signin" || pathname === "/register")) {

          setSignInOpen(true);

        } else {

          setSignInOpen(false);

        }

        setUpdated(false);
        setReady(true);

      }

    } else {

      setReady(false);

    }

    return () => mounted = false;
  
  }, [client, action, pathname, document.cookie, art]);

  // Listen for theme changes
  const [systemDark, setSystemDark] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);
  useEffect(() => {

    const themeCookie = document.cookie.match("(^|;)\\s*theme\\s*=\\s*([^;]+)")?.pop() || null;
    if (themeCookie && themeCookie !== "0") {

      document.body.classList.add("light");

    } else {

      document.body.classList.remove("light");

    }

  }, [document.cookie]);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => setSystemDark(event.matches));

  // Return the component
  const [popups, setPopups] = useState([]);
  function addPopup(popup) {

    setPopups(previousPopups => {

      const newPopups = [...previousPopups];
      newPopups.push(popup);
      return newPopups;

    });

  }

  useEffect(() => {

    if (criticalError) {

      throw criticalError;

    }

  }, [criticalError]);

  return (
    <>
      <ConnectivityCheck 
        api={api}
        authenticated={client?.user !== undefined}
        ready={ready}
        setClient={setClient}
      />
      {
        ready && client && (
          <>
            <Authenticator open={signInOpen} shownLocation={shownLocation} client={client} />
            <PopupManager popups={popups} popupsChanged={newPopups => setPopups(newPopups)} />
            {artViewerOpen && (
              <Art 
                client={client}
                art={art}
                artRegex={artRegex}
                artDeleted={() => setUpdated(true)}
                onClose={() => {

                  navigate(shownLocation);
                  setArtViewerOpen(false);

                }} 
              />
            )}
            <Submitter client={client} addPopup={addPopup} />
            <Header client={client} systemDark={systemDark} setLocation={setLocation} addPopup={addPopup} />
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
                    client={client} 
                    artViewerOpen={artViewerOpen}
                    setSettingsCache={setSettingsCache}
                    setCriticalError={setCriticalError}
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
                      client={client} 
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
                      client={client} 
                      shownLocation={shownLocation} 
                      setLocation={setLocation} 
                      settingsCache={settingsCache}
                      setSettingsCache={setSettingsCache}
                    />
                  )}
                />
              ))}
              <Route path="search" element={<Search client={client} />} />
            </Routes>
          </>
        )
      }
    </>
  );

}

App.propTypes = {
  history: PropTypes.object
};