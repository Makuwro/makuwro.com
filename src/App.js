import React, { useEffect, useState } from "react";
import { Route, Routes, useSearchParams, useLocation } from "react-router-dom";
import Home from "./components/Home";
import PropTypes from "prop-types";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Maintenance from "./components/Maintenance";
import ArtViewer from "./components/library/ArtViewer";
import Authenticator from "./components/Authenticator";
import Literature from "./components/library/Literature";
import Settings from "./components/Settings";
import Submitter from "./components/library/Submitter";
import ConnectivityCheck from "./components/ConnectivityCheck";
import Search from "./components/Search";
import Notifications from "./components/Notifications";
import "./styles/global.css";
import ImageCropTool from "./components/ImageCropTool";
import AlertManager from "./components/alerts/AlertManager";
import Footer from "./components/Footer";

export default function App() {

  // Check if the website is under maintenance
  const maintenance = false;
  if (maintenance) return <Maintenance />;
  
  // Set up the states
  const [client, setClient] = useState();
  const [ready, setReady] = useState(false);
  const [searchParams] = useSearchParams();
  const [settingsCache, setSettingsCache] = useState();

  // Check if we want to create something
  const action = searchParams.get("action");
  const location = useLocation();
  const pathname = location.pathname;
  const [updated, setUpdated] = useState(false);
  const [shownLocation, setLocation] = useState(location);
  const [signInOpen, setSignInOpen] = useState(false);
  const [criticalError, setCriticalError] = useState();

  useEffect(() => {

    let mounted = true;

    if (client) {

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
  
  }, [client, action, pathname, document.cookie]);

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

  useEffect(() => {

    if (criticalError) {

      throw criticalError;

    }

  }, [criticalError]);

  const [imageUrl, setImageUrl] = useState();
  const [alerts, setAlerts] = useState([]);

  function addAlert(config) {

    setAlerts((previousAlerts) => {

      const newAlerts = [...previousAlerts];
      newAlerts.unshift(config);
      return newAlerts;

    });

  }

  return (
    <>
      <ConnectivityCheck
        authenticated={client?.user !== undefined}
        ready={ready}
        setClient={setClient}
      />
      {
        ready && client && (
          <>
            <Authenticator open={signInOpen} shownLocation={shownLocation} client={client} />
            <ImageCropTool client={client} imageUrl={imageUrl} />
            <Submitter client={client} />
            <Notifications client={client} shownLocation={shownLocation} />
            <ArtViewer client={client} setLocation={setLocation} />
            <Header client={client} systemDark={systemDark} setLocation={setLocation} />
            <AlertManager alerts={alerts} onChange={(index) => setAlerts((oldAlerts) => {
              
              const newAlerts = [...oldAlerts];
              newAlerts.splice(index, 1);
              return newAlerts;
            
            })} />
            <section id="scroll-container">
              <Routes location={shownLocation}>
                {["/", "/register", "/signin", "/notifications"].map((path, index) => {

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
                      setSettingsCache={setSettingsCache}
                      setCriticalError={setCriticalError}
                      addAlert={addAlert}
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
                        setImageUrl={setImageUrl}
                      />
                    )}
                  />
                ))}
                <Route path="search" element={<Search client={client} />} />
              </Routes>
              <Footer />
            </section>
          </>
        )
      }
    </>
  );

}

App.propTypes = {
  history: PropTypes.object
};