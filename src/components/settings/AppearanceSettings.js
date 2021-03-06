import React, { useEffect, useState } from "react";
import styles from "../../styles/Settings.module.css";
import Checkbox from "../input/Checkbox";
import Dropdown from "../input/Dropdown";
import SettingsDropdown from "./SettingsDropdown";
import PropTypes from "prop-types";

export default function AppearanceSettings({client, menu, toggleMenu}) {

  document.title = "Appearance settings / Makuwro";
  const [theme, setTheme] = useState(document.cookie.match("(^|;)\\s*theme\\s*=\\s*([^;]+)")?.pop() || 0);
  const [savedTheme, setSavedTheme] = useState();

  useEffect(() => {

    const themeCookie = document.cookie.match("(^|;)\\s*theme\\s*=\\s*([^;]+)")?.pop() || null;
    if (themeCookie && theme !== themeCookie) {
      
      setTheme(themeCookie);
      if (themeCookie !== "0") {

        document.body.classList.add("light");
  
      } else {
  
        document.body.classList.remove("light");
  
      }

    }

  }, [document.cookie]);

  function previewTheme(index) {

    setSavedTheme(theme);
    document.cookie = `theme=${index}; max-age=63072000; secure; path=/`;

  }

  return (
    <section id={styles.options}>
      <SettingsDropdown
        title="Theme"
        description="Change your theme for this browser."
        open={menu === 0}
        onClick={() => toggleMenu(0)}
      >
        <Dropdown index={parseInt(theme, 10)} onChange={previewTheme}>
          <li>Dark</li>
          <li>Light</li>
        </Dropdown>
      </SettingsDropdown>
      <SettingsDropdown
        title="Customize collaboration flags"
        description="How do you want us to tell you that your chums are on a paragraph?"
        open={menu === 1}
        onClick={() => toggleMenu(1)}
      >
        <Dropdown index={0}>
          <li>Show display names</li>
          <li>Show usernames</li>
          <li>Show avatars</li>
        </Dropdown>
      </SettingsDropdown>
    </section>
  );

}

AppearanceSettings.propTypes = {
  client: PropTypes.object,
  menu: PropTypes.number,
  toggleMenu: PropTypes.func
};