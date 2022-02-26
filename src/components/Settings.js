import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "../styles/Settings.module.css";
import * as pjson from "../../package.json"; 
import AccountSettings from "./settings/AccountSettings";
import AppearanceSettings from "./settings/AppearanceSettings";
import PrivacySettings from "./settings/PrivacySettings";
import ProfileSettings from "./settings/ProfileSettings";
import PropTypes from "prop-types";

export default function Settings({currentUser, setLocation, setCurrentUser}) {

  const [menu, setMenu] = useState();
  const [leaving, setLeaving] = useState(true);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const tabs = {
    "account": <AccountSettings 
      currentUser={currentUser} 
      menu={menu} 
      setMenu={setMenu} 
      submitting={submitting}
      updateAccount={updateAccount} />,
    "profile": <ProfileSettings 
      currentUser={currentUser} 
      setCurrentUser={setCurrentUser} 
      menu={menu} 
      toggleMenu={toggleMenu} 
      submitting={submitting}
      updateAccount={updateAccount} />,
    "appearance": <AppearanceSettings 
      currentUser={currentUser}
      menu={menu}
      toggleMenu={toggleMenu} />,
    "privacy": <PrivacySettings 
      currentUser={currentUser} />
  };
  const {tab} = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const menuOptions = ["Account", "Profile", "Appearance", "Privacy"];
  let i;

  function toggleMenu(index) {

    if (index === menu) {

      setMenu();

    } else {

      setMenu(index);

    }

  }

  async function updateAccount(event, key, value, resetFields, password, passwordAgain) {

    // Don't refresh the page, please.
    event.preventDefault();

    if (key === "newPassword" && passwordAgain !== value) {

      return alert("Your password doesn't match!");

    }


    if (!submitting && value !== currentUser[key]) {

      // Prevent multiple requests while we do this.
      setSubmitting(true);
        
      try {

        // Turn it into a FormData object.
        const formData = new FormData();
        formData.append(key, value);
        if (key === "newPassword" || key === "email" || key === "isDisabled") {

          formData.append("password", password);

        }

        // Send the request to change the value.
        const response = await fetch(`${process.env.RAZZLE_API_DEV}accounts/user`, {
          method: "PATCH",
          headers: {
            token: currentUser.token
          },
          body: formData
        });

        if (response.ok) {

          // Save the new username to the state.
          if (key !== "newPassword") {

            setCurrentUser({...currentUser, [key + (key === "avatar" || key === "banner" ? "Url" : "")]: key === "avatar" || key === "banner" ? URL.createObjectURL(value) : value});

          }
          
          if (key !== "isDsiabled") {

            alert("Saved!");

          }

          // Reset the field.
          resetFields();

          // Close the menu.
          setMenu();

          // We can submit requests again!
          setSubmitting(false);

          return true;

        } else {

          const {message} = await response.json();

          alert(message);
          
        }

      } catch (err) {

        alert(err.message);

      }

      // We can submit requests again!
      setSubmitting(false);

    }

  }

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
        <Link to={path} className={path === location.pathname ? styles.selected : ""} onClick={() => setMenu()}>
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

Settings.propTypes = {
  currentUser: PropTypes.object,
  setLocation: PropTypes.func,
  setCurrentUser: PropTypes.func
};