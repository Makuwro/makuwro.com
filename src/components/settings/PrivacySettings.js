import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Settings.module.css";
import Checkbox from "../input/Checkbox";
import Dropdown from "../input/Dropdown";
import SettingsDropdown from "./SettingsDropdown";

export default function PrivacySettings({currentUser, menu, toggleMenu}) {

  const navigate = useNavigate();
  document.title = "Privacy settings / Makuwro";

  return (
    <section id={styles.options}>
      <SettingsDropdown
        title="Blocked members"
        description="View and manage your blocked members here."
        open={menu === 0}
        onClick={() => toggleMenu(0)}
      >
        <p>If they create alternate accounts to bypass your block, please report them.</p>
        <Dropdown>
          
        </Dropdown>
      </SettingsDropdown>
      <SettingsDropdown
        title="Guests and your content"
        description="Manage guest access to your content."
        open={menu === 1}
        onClick={() => toggleMenu(1)}
      >
        <p>Allowing guests might improve your discoverability. However, it can be problematic if you want to enforce your block list. Here, you get the choice.</p>
        <Checkbox>Allow users to view my profile and my content without signing in</Checkbox>
      </SettingsDropdown>
      <SettingsDropdown
        title="Optional data that you can send to Makuwro"
        description="There is some extra data you can give us so we can make the Makuwro experience better for you and everyone else."
        open={menu === 2}
        onClick={() => toggleMenu(2)}
      >
        <Checkbox 
        
          onClick={(checked) => {

            if (!checked && !confirm("If you uncheck this, the content you see in the library might be less relevant to you. Are you sure you want to do this?")) {

              return;

            }

          }}
        >
          Use my data to personalize my experience
        </Checkbox>
        <Checkbox>Use my data to improve Makuwro</Checkbox>
      </SettingsDropdown>
      <SettingsDropdown
        title="Request your data"
        description="Want to know everything we know about you? Give us up to 30 days to package your data, and then we'll shoot you an email."
        open={menu === 3}
        onClick={() => toggleMenu(3)}
      >
        <button>Request my data</button>
      </SettingsDropdown>
      <section className="info">
        Wondering how we use your data and who we share your data to? Give the <a href="https://help.makuwro.com/policies/privacy">privacy policy</a> a read.
      </section>
    </section>
  );

}