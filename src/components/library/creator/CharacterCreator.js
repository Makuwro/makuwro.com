import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../../styles/Library.module.css";
import Dropdown from "../../Dropdown";
import Popup from "../../Popup";

export default function CharacterCreator({username}) {

  const state = {
    name: useState(""),
    avatar: useState(),
    tags: useState(),
    url: useState()
  };
  const ref = {
    avatar: useRef(),
    url: useRef()
  };

  function updateAvatar([file]) {

    // Make sure we have a file
    if (file) state.avatarURL[1](URL.createObjectURL(file));

  }

  function updateInput({target: {value: value}}, name) {

    //if (name !== "characterURL" || !value || /^(?!\.|-)(\w|[-.])+(?<!\.|-)$/.test(value)) {
      
    state[name][1](value);

    //}

  }

  return (
    <Popup title="Create character" queried={true}>
      <form id={styles["upload-character"]}>
        <section>
          <section>
            <input type="file" style={{display: "none"}} ref={ref.avatar} onChange={({target}) => updateAvatar(target.files)} accept="image/*" />
            <img src={state.avatar[0]} onClick={() => ref.avatarUrl.current.click()} id={styles.avatar} />
          </section>
          <h1>Basics</h1>
          <section>
            <label htmlFor="name">Character name</label>
            <p>This name will be the first thing people see on the page.</p>
            <input type="text" required onChange={(event) => updateInput(event, "name")} value={state.name[0]} />
          </section>
          <section>
            <label>Description</label>
            <p>This description is shown below your character's name on their page.</p>
            <textarea onChange={(e) => {

              e.preventDefault();
              //setDescription(e.target.value);

            }}></textarea>
          </section>
          <section>
            <label>Who created this character?</label>
            <Dropdown defaultIndex={0}>
              <li>I am the sole creator of this character</li>
              <li>I collaborated with another on-site creator</li>
              <li>I collaborated with an off-site creator</li>
              <li>I got this character from an on-site creator</li>
              <li>I got this character from an off-site creator</li>
            </Dropdown>
          </section>
        </section>
        <section>
          <h1>Organization</h1>
          <section>
            <label htmlFor="tags">Tags</label>
            <p>You can use tags to sort your characters and easily find them later.</p>
            <input type="text" name="tags" onChange={(event) => updateInput(event, "tags")} value={state.tags[0]} />
          </section>
          <section>
            <label>Folders</label>
            <p>You can add your character to multiple folders.</p>
            <Dropdown>

            </Dropdown>
          </section>
          <section>
            <label>Worlds</label>
            <p>You can directly add your character to worlds you manage here. To add your character to a world you don't manage, you have to create this character first, then submit a request to the world admins.</p>
            <Dropdown>

            </Dropdown>
          </section>
        </section>
        <section>
          <h1>Sharing</h1>
          <section>
            <label htmlFor="url">Character URL</label>
            <p>Only alphanumeric characters, underscores, hyphens, and periods are allowed.</p>
            <section className="input-with-prefix">
              <span onClick={() => {

                ref.characterURL.current.focus();
                ref.characterURL.current.setSelectionRange(0, 0);

              }}>{`makuwro.com/${username}/characters/`}</span>
              <input type="text" name="url" ref={ref.url} onChange={(event) => updateInput(event, "characterURL")} value={state.url[0]} placeholder={state.name[0].replaceAll(" ", "-")}/>
            </section>
          </section>
          <section>
            <label>Who can view this character?</label>
            <Dropdown defaultIndex={0}>
              <li>Everyone, including visitors who aren't logged in</li>
              <li>Registered Makuwro users</li>
              <li>My followers</li>
              <li>My friends</li>
              <li>Specific people</li>
              <li>Just me</li>
            </Dropdown>
          </section>
          <section>
            <label>Who can comment on this character?</label>
            <Dropdown defaultIndex={0}>
              <li>Registered Makuwro users</li>
              <li>My followers</li>
              <li>My friends</li>
              <li>Specific people</li>
              <li>Just me</li>
            </Dropdown>
          </section>
          <section>
            <label>Who can view comments on this character?</label>
            <Dropdown defaultIndex={0}>
              <li>Everyone, including visitors who aren't logged in</li>
              <li>Registered Makuwro users</li>
              <li>My followers</li>
              <li>My friends</li>
              <li>Specific people</li>
              <li>Just me</li>
            </Dropdown>
          </section>
          <section>
            <label>Character transferability</label>
            <section>
              <input type="checkbox" name="tradable" />
              <label htmlFor="tradable">This character is tradable</label>
            </section>
            <section>
              <input type="checkbox" name="sellable" />
              <label htmlFor="sellable">This character is sellable</label>
            </section>
            <section>
              <input type="checkbox" name="giftable" />
              <label htmlFor="giftable">This character is giftable</label>
            </section>
          </section>
          <section>
            <label>Terms of use</label>
            <p>This will be shown on your character's page. Your <a href={`/${username}/terms`}>global terms of use</a> will be shown below this.</p>
            <textarea>

            </textarea>
          </section>
        </section>
        <input type="submit" value="Create character" />
      </form>
    </Popup>
  );

}

CharacterCreator.propTypes = {
  username: PropTypes.string
};