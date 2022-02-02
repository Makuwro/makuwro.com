import React, { useRef, useState } from "react";
import styles from "../../../styles/Library.module.css";
import Dropdown from "../../Dropdown";
import PropTypes from "prop-types";

export default function ArtCreator({username, setPopupSettings}) {

  const ref = {
    art: useRef(),
    url: useRef()
  };
  const state = {
    art: useState(),
    caption: useState(""),
    tags: useState(""),
    url: useState("")
  };

  function updateInput({target: {value: value}}, name) {
      
    state[name][1](value);

  }

  setPopupSettings({
    title: "Upload art",
    warnUnfinished: true
  });

  return (
    <form id={styles["upload-art"]}>
      <p>You can tag your characters and share your art with others.</p>
      <section>
        <section>
          <input type="file" accept="image/*" style={{display: "none"}} ref={ref.art} onChange={({target: {files: [file]}}) => state.art[1](URL.createObjectURL(file))} />
          {state.art[0] && (
            <img src={state.art[0]} style={{
              marginBottom: "1rem"
            }} />
          )}
          <button onClick={(event) => {

            event.preventDefault();
            ref.art.current.click();

          }}>{state.art[0] ? "Re-s" : "S"}elect image</button>
          <p>Please only upload content that you have permission to use.</p>
        </section>
      </section>
      <section>
        <h1>Basics</h1>
        <section>
          <label>Name<span style={{
            color: "var(--night-text)",
            marginLeft: "0.5rem"
          }}>(optional)</span></label>
          <input type="text" />
        </section>
        <section>
          <label>Caption<span style={{
            color: "var(--night-text)",
            marginLeft: "0.5rem"
          }}>(optional)</span></label>
          <textarea></textarea>
        </section>
        <section>
          <label>Who created this art?</label>
          <Dropdown defaultIndex={0}>
            <li>I am the sole artist</li>
            <li>I collaborated with another on-site artist</li>
            <li>I collaborated with an off-site artist</li>
            <li>I got this from an on-site artist</li>
            <li>I got this from an off-site artist</li>
          </Dropdown>
        </section>
      </section>
      <section>
        <h1>Organization</h1>
        <section>
          <label htmlFor="tags">Tags<span style={{
            color: "var(--night-text)",
            marginLeft: "0.5rem"
          }}>(optional)</span></label>
          <p>You can use tags to sort your characters and easily find them later.</p>
          <input type="text" name="tags" onChange={(event) => updateInput(event, "tags")} value={state.tags[0]} />
        </section>
        <section>
          <label>Folders<span style={{
            color: "var(--night-text)",
            marginLeft: "0.5rem"
          }}>(optional)</span></label>
          <p>You can add your character to multiple folders.</p>
          <Dropdown>

          </Dropdown>
        </section>
        <section>
          <label>Worlds<span style={{
            color: "var(--night-text)",
            marginLeft: "0.5rem"
          }}>(optional)</span></label>
          <p>You can directly add your character to worlds you manage here. To add your character to a world you don't manage, you have to create this character first, then submit a request to the world admins.</p>
          <Dropdown>

          </Dropdown>
        </section>
      </section>
      <section>
        <h1>Sharing</h1>
        <section>
          <label htmlFor="url">Image URL</label>
          <p>Only alphanumeric characters, underscores, hyphens, and periods are allowed.</p>
          <section className="input-with-prefix">
            <span onClick={() => {

              ref.url.current.focus();
              ref.url.current.setSelectionRange(0, 0);

            }}>{`makuwro.com/${username}/images/`}</span>
            <input type="text" name="url" ref={ref.url} onChange={(event) => updateInput(event, "characterURL")} value={state.url[0]}/>
          </section>
        </section>
        <section>
          <label>Who can see the watermarked version of this image?</label>
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
          <label>Who can see the non-watermarked version of this image?</label>
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
          <label>Who can view comments on this image?</label>
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
          <label>Who can comment on this image?</label>
          <Dropdown defaultIndex={0}>
            <li>Registered Makuwro users</li>
            <li>My followers</li>
            <li>My friends</li>
            <li>Specific people</li>
            <li>Just me</li>
          </Dropdown>
        </section>
        <section>
          <label>Would you like to age-restrict this image?</label>
          <p>If so, users must sign in to view this image. If you inappropriately age-gate your image, Makuwro staff might enforce this setting.</p>
          <Dropdown defaultIndex={0}>
            <li>No</li>
            <li>Yes, restrict users under 13 from viewing this</li>
            <li>Yes, restrict users under 17 from viewing this</li>
            <li>Yes, restrict users under 18 from viewing this</li>
          </Dropdown>
        </section>
        <section>
          <label>Content warning<span style={{
            color: "var(--night-text)",
            marginLeft: "0.5rem"
          }}>(optional)</span></label>
          <p>This text will be shown to viewers before they view this image.</p>
          <textarea></textarea>
        </section>
      </section>
      <input type="submit" value="Upload art" />
    </form>
  );

}

ArtCreator.propTypes = {
  username: PropTypes.string,
  setPopupSettings: PropTypes.func
};