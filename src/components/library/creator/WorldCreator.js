import React, { useRef, useState } from "react";
import styles from "../../../styles/Library.module.css";
import Dropdown from "../../Dropdown";
import Popup from "../../Popup";

export default function WorldCreator() {

  const state = {
    name: useState(""),
    username: useState(""),
    description: useState(),
    avatar: useState(),
    url: useState(),
    bannerURL: useState(),
    tags: useState()
  };
  const ref = {
    banner: useRef(),
    url: useRef()
  };

  function updateBanner([file]) {

    // Make sure we have a file
    if (file) state.bannerURL[1](URL.createObjectURL(file));

  }

  function updateInput({target: {value: value}}, name) {

    //if (name !== "characterURL" || !value || /^(?!\.|-)(\w|[-.])+(?<!\.|-)$/.test(value)) {
      
    state[name][1](value);

    //}

  }

  return (
    <Popup title="Create world" queried={true}>
      <form id={styles["create-world"]}>
        <section>
          <h1>Basics</h1>
          <section>
            <input type="file" style={{display: "none"}} ref={ref.banner} onChange={({target}) => updateBanner(target.files)} accept="image/*" />
            <img src={state.bannerURL[0]} onClick={() => ref.banner.current.click()} id={styles.banner} />
          </section>
          <section>
            <label>Profile image</label>
            <button>Change image</button>
            <button>Remove image</button>
          </section>
          <section>
            <label>Banner</label>
            <button>Change banner</button>
            <button>Remove banner</button>
          </section>
          <section>
            <label htmlFor="name">Display name</label>
            <p>This name will represent the team.</p>
            <input type="text" required onChange={(event) => updateInput(event, "name")} value={state.name[0]} />
          </section>
          <section>
            <label htmlFor="name">Username</label>
            <p>This name will appear after makuwro.com. Only alphanumeric characters, underscores, hyphens, and periods are allowed.</p>
            <section className="input-with-prefix">
              <span onClick={() => {

                ref.url.current.focus();
                ref.url.current.setSelectionRange(0, 0);

              }}>@</span>
              <input type="text" name="username" ref={ref.username} onChange={(event) => updateInput(event, "username")} value={state.username[0]} placeholder={state.name[0].replaceAll(" ", "-")}/>
            </section>
          </section>
        </section>
        <section>
          <h1>Security</h1>
          <section>
            <label>Who can view this team's profile?</label>
            <Dropdown index={0}>
              <li>Everyone, including visitors who aren't signed in</li>
              <li>Registered Makuwro users</li>
              <li>Team followers</li>
              <li>Team members</li>
            </Dropdown>
          </section>
          <section>
            <label>May others join this team?</label>
            <Dropdown index={0}>
              <li>This team is invite-only</li>
              <li>Anyone may request to join this team, but they have to be approved</li>
              <li>Anyone may join this team</li>
            </Dropdown>
          </section>
        </section>
        <input type="submit" value="Create team" />
      </form>
    </Popup>
  );

}