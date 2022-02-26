import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Settings.module.css";
import Checkbox from "../input/Checkbox";
import Dropdown from "../input/Dropdown";
import SettingsDropdown from "./SettingsDropdown";
import Editor from "@monaco-editor/react";

export default function ProfileSettings({currentUser, menu, toggleMenu, submitting, updateAccount}) {

  const [terms, setTerms] = useState(currentUser.terms || "");
  const [css, setCSS] = useState(currentUser.css || "");
  const [about, setAbout] = useState(currentUser.about || "");
  const bannerImage = useRef();

  function resetFields() {

    setTerms(currentUser.terms || "");
    setCSS(currentUser.css || "");

  }

  async function updateAccountWrapper(event, key, value) {

    return await updateAccount(event, key, value, resetFields);

  }

  document.title = "Profile settings / Makuwro";

  return (
    <>
      <section id={styles.options}>
        <SettingsDropdown
          title="Banner image"
          description="This image will be shown at the top of your profile."
          open={menu === 1}
          onClick={() => toggleMenu(1)}
        >
          <form>
            <input type="file" ref={bannerImage} accept="image/*" style={{display: "none"}} onChange={(event) => {
              
              updateAccountWrapper(event, "banner", event.target.files[0]);
            
            }} />
            <input type="button" value="Change banner image" disabled={submitting} onClick={() => bannerImage.current.click()} />
          </form>
        </SettingsDropdown>
        <SettingsDropdown
          title="Badges"
          description="We might give you some cool badges you can hang up on your profile. You can choose which badge you want to show here."
          open={menu === 2}
          onClick={() => toggleMenu(2)}
        >
          <form>
            <label>Shown badge</label>
            <Dropdown>

            </Dropdown>
            <input type="submit" value="Save" />
          </form>
        </SettingsDropdown>
        <SettingsDropdown
          title="About"
          description="Manage the about section of your profile."
          open={menu === 3}
          onClick={() => toggleMenu(3)}
        >
          <form onSubmit={(event) => updateAccountWrapper(event, "about", about)}>
            <Editor
              height="150px"
              defaultLanguage="html"
              theme="vs-dark"
              defaultValue={about}
              onChange={(value) => setAbout(value)}
              options={{
                minimap: {
                  enabled: false
                },
                contextmenu: false,
                tabSize: 2,
                wordWrap: true,
                wrappingStrategy: "advanced"
              }}
            />
            <input type="submit" value="Save" disabled={submitting} />
          </form>
        </SettingsDropdown>
        <SettingsDropdown
          title="Profile CSS"
          description="Manage your profile stylesheet."
          open={menu === 4}
          onClick={() => toggleMenu(4)}
        >
          <p>Need to find class and ID names? Use inspect element by pressing F12 or CTRL+SHIFT+I! There isn't a really easy way to do this on mobile, but I won't stop you.</p>
          <p className="info">If you hide the report and block buttons, you must provide an alternative.</p>
          <form onSubmit={(event) => updateAccountWrapper(event, "css", css)}>
            <Editor
              height="150px"
              defaultLanguage="css"
              theme="vs-dark"
              defaultValue={css}
              onChange={(value) => setCSS(value)}
              options={{
                minimap: {
                  enabled: false
                },
                contextmenu: false,
                tabSize: 2
              }}
            />
            <input type="submit" value="Save" disabled={submitting} />
          </form>
        </SettingsDropdown>
        <SettingsDropdown
          title="Terms"
          description="View or modify your terms that apply to all of your characters, art, literature, and worlds."
          open={menu === 5}
          onClick={() => toggleMenu(5)}
        >
          <p>This will be shown on <Link to={`/${currentUser.username}/terms`}>your profile</Link>.</p>
          <form onSubmit={(event) => updateAccountWrapper(event, "terms", terms)}>
            <textarea placeholder="All rights reserved. Do not use my work without my explicit permission." value={terms} onInput={(event) => setTerms(event.target.value)} />
            <input type="submit" value="Save" disabled={submitting} />
          </form>
        </SettingsDropdown>
      </section>
    </>
  );

}