import React, { useEffect, useState } from "react";
import styles from "../../../styles/LibraryViewer.module.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function ArtViewer({username, id}) {

  let [image, setImage] = useState({
    url: "https://pbs.twimg.com/media/FIL8VyuWYAIM1UW?format=png&name=small",
    caption: "i'm sketching sudobeast out on digital and yeah...he's extremely furry",
    timestamp: "January 24, 2022 at 10:37 PM"
  });
  let [creator, setCreator] = useState({
    avatar: "https://pbs.twimg.com/profile_images/1477875323953991682/MM_ZZPTh_400x400.jpg",
    display_name: "Christian Toney",
    username: "Christian"
  });
  let [comments, setComments] = useState([]);
  let [open, setOpen] = useState(true);
  let [commentsOpen, toggleComments] = useState(false);
  let [commentsEnabled, toggleCommentsEnabled] = useState(true);

  return (
    <section id={styles.viewer} className={!open ? styles.closed : null}>
      <section id={styles.content}>
        <section id={styles["image-background"]} onClick={() => setOpen(false)}>
          <img src={image.url} onClick={(event) => event.stopPropagation()} />
        </section>
        <section id={styles.artist}>
          <img src={creator.avatar} />
          <h1>
            {creator.display_name}
          </h1>
          <h2>
            @{creator.username}
          </h2>
          <Link to={`/${creator.username}/terms`}>Terms of use</Link>
          <Link to={`/${creator.username}/terms`}>Report</Link>
        </section>
      </section>
      <section id={styles.right}>
        <section id={styles.details} className={commentsOpen ? styles.closed : null}>
          <section id={styles.metadata}>
            <p>
              {image.caption}
            </p>
            <dl>
              <dt>Collaborators</dt>
              <dd>None</dd>
              <dt>Characters</dt>
              <dd><Link to="/Christian/characters/Sudobeast">Sudobeast</Link></dd>
              <dt>Folders</dt>
              <dd><Link to="/Christian/folders/personas">Personas</Link></dd>
              <dt>Worlds</dt>
              <dd><Link to="/Showrunners/worlds/the-showrunners">Sudobeast Universe</Link> and <Link to="/Showrunners/worlds/the-showrunners">The Showrunners</Link></dd>
              <dt>Started</dt>
              <dd>January 3, 2021</dd>
              <dt>Completed</dt>
              <dd>Work in progress</dd>
              <dt>Uploaded</dt>
              <dd>{image.timestamp}</dd>
              <dt>Visible to</dt>
              <dd>Everyone</dd>
            </dl>
          </section>
          <section id={styles.actions}>
            <button id={styles.like} className={!commentsEnabled ? styles.disabled : false} onClick={() => toggleComments(true)}>Like</button>
            <button id={styles["show-comments"]} className={!commentsEnabled ? styles.disabled : false} onClick={() => toggleComments(true)}>{commentsEnabled ? "Comments (0)" : "Comments disabled"}</button>
          </section>
        </section>
        <section id={styles.comments}>
          <form id={styles["comment-creator"]}>
            <textarea></textarea>
            <input type="submit" />
          </form>
        </section>
      </section>
    </section>
  );

}

ArtViewer.propTypes = {
  username: PropTypes.string,
  id: PropTypes.string
};