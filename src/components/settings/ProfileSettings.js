import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Settings.module.css";
import Checkbox from "../input/Checkbox";
import SettingsDropdown from "./SettingsDropdown";

export default function ProfileSettings({currentUser, setCurrentUser}) {

  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  document.title = "Profile settings / Makuwro";

  return (
    <>
      <section id={styles.options}>
        <SettingsDropdown
          title="Avatar"
          description="This image will be shown on your profile and on all of your published content."
        >
          <img className={styles.avatar} src={`https://cdn.makuwro.com/${currentUser.avatarPath}`} />
          <button>Change avatar</button>
        </SettingsDropdown>
        <SettingsDropdown
          title="Cover image"
          description="This image will be shown at the top of your profile."
        >
          <button>Change cover image</button>
        </SettingsDropdown>
        <SettingsDropdown
          title="Badges"
          description="We might give you some cool badges you can hang up on your profile. You can manage these badges here."
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
        >
        </SettingsDropdown>
        <SettingsDropdown
          title="Profile CSS"
          description="Manage your profile stylesheet."
        >
        </SettingsDropdown>
      </section>
    </>
  );

}