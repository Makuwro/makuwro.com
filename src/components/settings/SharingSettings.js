import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Settings.module.css";
import PropTypes from "prop-types";
import Dropdown from "../input/Dropdown";
import SettingsDropdown from "./SettingsDropdown";
import Editor from "@monaco-editor/react";
import SlugInput from "../input/SlugInput";

export default function SharingSettings({client, menu, toggleMenu, submitting, updateAccount, character, blogPost}) {

  const {user} = client;
  const [terms, setTerms] = useState((character || user).terms || "");
  const [css, setCSS] = useState((character || user).css || "");
  const [about, setAbout] = useState((character ? character.description : user.about) || "");
  const bannerImage = useRef();
  const avatarImage = useRef();

  function resetFields() {

    setAbout((character ? character.description : user.about) || "")
    setTerms((character || user).terms || "");
    setCSS((character || user).css || "");

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
          <p className="info">Head's up! If you change this, we won't redirect your old URL because we want to allow you to reuse it for something else.</p>
          <form>
            <SlugInput 
              username={blogPost.owner.username}
              slug={blogPost.slug}
              path="blog"
            />
            <input style={{marginTop: "1rem"}} type="submit" value="Change avatar" disabled={submitting} />
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
  client: PropTypes.object.isRequired, 
  menu: PropTypes.number, 
  toggleMenu: PropTypes.func.isRequired,
};