import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Settings.module.css";
import Checkbox from "../input/Checkbox";
import SettingsDropdown from "./SettingsDropdown";

export default function ProfileSettings({currentUser, setCurrentUser, menu, setMenu, submitting, setSubmitting}) {

  document.title = "Profile settings / Makuwro";

  function toggleMenu(index) {

    if (index === menu) {

      setMenu();

    } else {

      setMenu(index);

    }

  }

  return (
    <>
      <section id={styles.options}>
        <SettingsDropdown
          title="Cover image"
          description="This image will be shown at the top of your profile."
          open={menu === 1}
          onClick={() => toggleMenu(1)}
        >
          <button>Change cover image</button>
        </SettingsDropdown>
        <SettingsDropdown
          title="Badges"
          description="We might give you some cool badges you can hang up on your profile. You can manage these badges here."
          open={menu === 2}
          onClick={() => toggleMenu(2)}
        >
          {currentUser.isStaff && (
            <Checkbox>Show STAFF badge</Checkbox>
          )}
          <Checkbox>Show ALPHA badge</Checkbox>
          <button>Manage badges</button>
        </SettingsDropdown>
        <SettingsDropdown
          title="Pages"
          description="View and manage your profile pages."
          open={menu === 3}
          onClick={() => toggleMenu(3)}
        >
        </SettingsDropdown>
        <SettingsDropdown
          title="Profile CSS"
          description="Manage your profile stylesheet."
          open={menu === 4}
          onClick={() => toggleMenu(4)}
        >
        </SettingsDropdown>
        <SettingsDropdown
          title="Terms"
          description="View or modify your terms that apply to all of your characters, art, literature, and worlds."
          open={menu === 5}
          onClick={() => toggleMenu(5)}
        >
          <p>This will be shown on <Link to={`/${currentUser.username}/terms`}>your profile</Link>.</p>
          <textarea placeholder="All rights reserved. Do not use my work without my explicit permission." />
        </SettingsDropdown>
      </section>
    </>
  );

}