import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Settings.module.css";
import Checkbox from "../input/Checkbox";
import Dropdown from "../input/Dropdown";

export default function AppearanceSettings({currentUser}) {

  const navigate = useNavigate();
  document.title = "Appearance settings / Makuwro";

  return (
    <>
      <section>
        <section>
          <h1>Theme</h1>
          <p>There'll be more themes in v1.1.0, I promise.</p>
          <Dropdown index={0}>
            <li>Dark</li>
          </Dropdown>
        </section>
        <section>
          <h1>Accessibility</h1>
          <Checkbox>Disable custom CSS</Checkbox>
        </section>
      </section>
    </>
  );

}