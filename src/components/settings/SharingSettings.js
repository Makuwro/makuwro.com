import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Settings.module.css";
import PropTypes from "prop-types";
import Dropdown from "../input/Dropdown";
import SettingsDropdown from "./SettingsDropdown";
import Editor from "@monaco-editor/react";

export default function SharingSettings({currentUser, menu, toggleMenu, submitting, updateAccount, character, blogPost}) {

  const [terms, setTerms] = useState((character || currentUser).terms || "");
  const [css, setCSS] = useState((character || currentUser).css || "");
  const [about, setAbout] = useState((character ? character.description : currentUser.about) || "");
  const bannerImage = useRef();
  const avatarImage = useRef();

  function resetFields() {

    setAbout((character ? character.description : currentUser.about) || "")
    setTerms((character || currentUser).terms || "");
    setCSS((character || currentUser).css || "");

  }

  async function updateAccountWrapper(event, key, value) {

    return await updateAccount(event, key, value, resetFields);

  }

  document.title = "Sharing settings / Makuwro";

  return (
    <>
      <section id={styles.options}>
        <SettingsDropdown
          title="Blog URL"
          description="Don't like that random hash we generate when you create a post? Change it here."
          open={menu === 0}
          onClick={() => toggleMenu(0)}
        >
          <img className="avatar-preview" src={`${currentUser.avatarUrl || `https://cdn.makuwro.com/${(character || currentUser).avatarPath}`}`} />
          <form>
            <input required={true} type="file" accept="image/*" style={{display: "none"}} ref={avatarImage} onChange={(event) => {
              
              updateAccountWrapper(event, "avatar", event.target.files[0]);
            
            }} />
            <input style={{marginTop: "1rem"}} type="button" value="Change avatar" onClick={() => avatarImage.current.click()} disabled={submitting} />
          </form>
        </SettingsDropdown>
        <SettingsDropdown
          title="Publish or unpublish your post"
          description="This image will be shown at the top of your profile."
          open={menu === 1}
          onClick={() => toggleMenu(1)}
        >
          <p>Your blog post is currently <b>published</b>.</p>
          <form>
            <input type="button" value="ublish post" disabled={submitting} onClick={() => bannerImage.current.click()} />
          </form>
        </SettingsDropdown>
      </section>
    </>
  );

}

SharingSettings.propTypes = {
  currentUser: PropTypes.object.isRequired, 
  menu: PropTypes.number, 
  toggleMenu: PropTypes.func.isRequired,
};