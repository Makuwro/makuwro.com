import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../../styles/Library.module.css";
import Dropdown from "../../Dropdown";
import Checkbox from "../../Checkbox";

export default function LiteratureCreator({username, setPopupSettings}) {

  const state = {
    name: useState(""),
    description: useState(),
    tags: useState(),
    url: useState(),
    bannerURL: useState()
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

  useEffect(() => {

    setPopupSettings({
      title: "Create literature",
      warnUnfinished: true
    });

  }, []);

  return (
    <form id={styles["create-literature"]}>
      <section>
        <h1>Basics</h1>
        <section>
          <input type="file" style={{display: "none"}} ref={ref.banner} onChange={({target}) => updateBanner(target.files)} accept="image/*" />
          <img src={state.bannerURL[0]} onClick={() => ref.banner.current.click()} id={styles.banner} />
        </section>
        <section>
          <label>Banner</label>
          <button>Change banner</button>
          <button>Remove banner</button>
        </section>
        <section>
          <label htmlFor="name">Title</label>
          <p>This name will be the first thing people see on the page.</p>
          <input type="text" required onChange={(event) => updateInput(event, "name")} value={state.name[0]} />
        </section>
        <section>
          <label>Description</label>
          <p>This description is shown below your literature's name.</p>
          <textarea onChange={(e) => {

            e.preventDefault();
            //setDescription(e.target.value);

          }} value={state.description[0]}></textarea>
        </section>
        <Checkbox>
          This literature is a work in progress
        </Checkbox>
      </section>
      <section>
        <h1>Organization</h1>
        <section>
          <label htmlFor="tags">Tags</label>
          <p>You can use tags to sort your literature and easily find them later.</p>
          <input type="text" name="tags" onChange={(event) => updateInput(event, "tags")} value={state.tags[0]} />
        </section>
        <section>
          <label>Folders</label>
          <p>You can add your literature to multiple folders.</p>
          <Dropdown>

          </Dropdown>
        </section>
        <section>
          <label>Worlds</label>
          <p>You can directly add your literature to worlds you manage here. To add your literature to a world you don't manage, you have to create this literature first, then submit a request to the world admins.</p>
          <Dropdown>

          </Dropdown>
        </section>
      </section>
      <section>
        <h1>Sharing</h1>
        <section>
          <label htmlFor="url">Literature URL</label>
          <p>Only alphanumeric characters, underscores, hyphens, and periods are allowed.</p>
          <section className="input-with-prefix">
            <span onClick={() => {

              ref.url.current.focus();
              ref.url.current.setSelectionRange(0, 0);

            }}>{`makuwro.com/${username}/literature/`}</span>
            <input type="text" name="url" ref={ref.url} onChange={(event) => updateInput(event, "url")} value={state.url[0]} placeholder={state.name[0].replaceAll(" ", "-")}/>
          </section>
        </section>
        <section>
          <label>Who can view this literature?</label>
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
          <label>Who can comment on this literature?</label>
          <Dropdown defaultIndex={0}>
            <li>Registered Makuwro users</li>
            <li>My followers</li>
            <li>My friends</li>
            <li>Specific people</li>
            <li>Just me</li>
          </Dropdown>
        </section>
        <section>
          <label>Who can view comments on this literature?</label>
          <Dropdown defaultIndex={0}>
            <li>Everyone, including visitors who aren't logged in</li>
            <li>Registered Makuwro users</li>
            <li>My followers</li>
            <li>My friends</li>
            <li>Specific people</li>
            <li>Just me</li>
          </Dropdown>
        </section>
        <Checkbox>
          Disable likes
        </Checkbox>
        <Checkbox>
          Disable subscriptions
        </Checkbox>
      </section>
      <input type="submit" value="Create literature" />
    </form>
  );

}

LiteratureCreator.propTypes = {
  username: PropTypes.string,
  setPopupSettings: PropTypes.func
};