import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Settings.module.css";
import Checkbox from "../input/Checkbox";
import Dropdown from "../input/Dropdown";
import SettingsDropdown from "./SettingsDropdown";

export default function AppearanceSettings({currentUser}) {

  const navigate = useNavigate();
  document.title = "Appearance settings / Makuwro";

  return (
    <section id={styles.options}>
      <SettingsDropdown
        title="Theme"
        description="Change your theme for this browser."
      >
        <Dropdown index={0}>
          <li>Dark</li>
        </Dropdown>
      </SettingsDropdown>
    </section>
  );

}