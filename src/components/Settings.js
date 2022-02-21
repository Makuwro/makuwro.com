import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "../styles/Settings.module.css";
import * as pjson from "../../package.json"; 
import AccountSettings from "./settings/AccountSettings";
import AppearanceSettings from "./settings/AppearanceSettings";
import PrivacySettings from "./settings/PrivacySettings";
import ProfileSettings from "./settings/ProfileSettings";

export default function Settings({currentUser, setLocation, setCurrentUser}) {

  const tabs = {
    "account": <AccountSettings currentUser={currentUser} setCurrentUser={setCurrentUser} />,
    "profile": <ProfileSettings currentUser={currentUser} setCurrentUser={setCurrentUser} />,
    "appearance": <AppearanceSettings currentUser={currentUser} />,
    "privacy": <PrivacySettings currentUser={currentUser} />
  };
  const [leaving, setLeaving] = useState(true);
  const [ready, setReady] = useState(false);
  const {tab} = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const menuOptions = ["Account", "Profile", "Appearance", "Privacy"];
  let i;

  useEffect(() => {

    if (!currentUser.id) {

      // Can't manage settings if there are no settings.
      navigate(`/signin?redirect=${location.pathname}`, {replace: true});

    } else if (!tabs[tab]) {

      navigate("/settings/account", {replace: true});

    } else {

      setReady(true);

    }
    
  }, [tab]);

  useEffect(() => {

    if (ready && location.pathname.slice(0, 9) === "/settings") {

      setLeaving(false);
      setLocation(location);

    } else {

      setLeaving(true);

    }

  }, [location, ready]);

  for (i = 0; menuOptions.length > i; i++) {

    const name = menuOptions[i];
    const path = `/settings/${name.toLowerCase().replaceAll(" ", "-")}`;

    menuOptions[i] = (
      <li key={i}>
        <Link to={path} className={path === location.pathname ? styles.selected : ""}>
          {name}
        </Link>
      </li>
    );

  }

  async function signOut() {

    if (confirm("Are you sure you want to sign out?")) {

      try {

        // Send a request to invalidate this cookie
        const response = await fetch(`${process.env.RAZZLE_API_DEV}accounts/user/sessions`, {
          method: "DELETE",
          headers: {
            token: currentUser.token
          }
        });

        if (response.ok) {

          // Delete the token cookie
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

          // Redirect to the home page
          navigate("/");

        }

      } catch (err) {

        alert("Couldn't sign you out");

      }

    }

  }

  return ready ? (
    <main id={styles.settings} className={leaving ? "leaving" : null} onTransitionEnd={() => {

      if (leaving) {

        setLocation(location);

      }

    }}>
      <section>
        <section id={styles.left}>
          <ul>
            {menuOptions}
            <li><button onClick={signOut}>Sign out</button></li>
          </ul>
          <p>Makuwro.com v{pjson.version}</p>
        </section>
        <section id={styles.viewer}>
          {tabs[tab] || null}
        </section>
      </section>
    </main>
  ) : null;

}