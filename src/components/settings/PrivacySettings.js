import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Settings.module.css";
import Checkbox from "../input/Checkbox";
import Dropdown from "../input/Dropdown";
import SettingsDropdown from "./SettingsDropdown";

export default function PrivacySettings({client, menu, toggleMenu}) {

  const {user} = client;
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
        <Checkbox checked={!user.isBlockingGuestInteractions}>Allow users to view my profile and my content without signing in</Checkbox>
      </SettingsDropdown>
      <SettingsDropdown
        title="Data that you give to Makuwro, LLC"
        description="View and manage what we know about you."
        open={menu === 2}
        onClick={() => toggleMenu(2)}
      >
        <h3>Optional data you can give us</h3>
        <section>
          <Checkbox 
          
            onClick={(checked) => {

              if (!checked && !confirm("If you uncheck this, the content you see in the library might be less relevant to you. Are you sure you want to do this?")) {

                return;

              }

            }}
          >
            Use my data to personalize my experience
          </Checkbox>
        </section>
        <Checkbox>Use my data to improve Makuwro</Checkbox>
        <h3>Required data for Makuwro to work</h3>
        <p>We require some data to make Makuwro work for you. As such, there are some things that you can't toggle unless you delete your account. Some data includes your email address and your password. You can always view what qualifies in the <a href="https://help.makuwro.com/policies/privacy">privacy policy</a>.</p>
      </SettingsDropdown>
      <SettingsDropdown
        title="Request your data"
        description="Want to know everything we know about you? Give us up to 30 days to package your data, and then we'll shoot you an email."
        open={menu === 3}
        onClick={() => toggleMenu(3)}
      >
        <button>Request my data</button>
      </SettingsDropdown>
    </section>
  );

}