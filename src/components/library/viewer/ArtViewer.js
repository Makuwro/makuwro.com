import React, { useEffect, useState } from "react";
import styles from "../../../styles/LibraryViewer.module.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Comment from "../../Comment";
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function ArtViewer({open, currentUser, username, slug, onClose}) {

  let [art, setArt] = useState();
  let [owner, setOwner] = useState();
  let [comments, setComments] = useState(
    <>
      <Comment name="Christian Toney" username="Christian" avatarUrl="https://pbs.twimg.com/profile_images/1477875323953991682/MM_ZZPTh_400x400.jpg">
        Test
      </Comment>
      <Comment name="Christian Toney" username="Christian" avatarUrl="https://pbs.twimg.com/profile_images/1477875323953991682/MM_ZZPTh_400x400.jpg">
        Another test comment!
      </Comment>
    </>
  );
  let [commentsOpen, toggleComments] = useState(false);
  let [commentsEnabled, toggleCommentsEnabled] = useState(true);
  let [commenting, setCommenting] = useState(false);
  let [ready, setReady] = useState(false);

  useEffect(() => {

    if (art) {

      document.title = `${username}: ${art.description} / Makuwro`;

    }

  }, [open]);

  useEffect(async () => {

    if (username && slug) {

      // Get the stuff from the server.
      const headers = currentUser.token ? {
        token: currentUser.token
      } : {};

      // Get the user info from the server.
      const userResponse = await fetch(`${process.env.RAZZLE_API_DEV}accounts/users/${username}`, {headers});

      if (userResponse.ok) {

        setOwner(await userResponse.json());

        // Get the art from the server.
        const artResponse = await fetch(`${process.env.RAZZLE_API_DEV}contents/art/${username}/${slug}`, {headers});

        // Check if everything's OK.
        if (artResponse.ok) {

          const art = await artResponse.json();
          const date = new Date(art.uploadedOn);
          let i;
          console.log(art.uploadedOn);

          art.uploadedOn = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

          // Fix the collaborators
          for (i = 0; art.collaborators.length > i; i++) {

            const collaborator = art.collaborators[i];
            art.collaborators[i] = <Link to={`/${collaborator.username}`} key={collaborator.id}>{collaborator.displayName || `@${collaborator.username}`}</Link>;

          }

          // Update the art details.
          setArt(art);
          
        }

      }

      setReady(true);

      return () => {

        setOwner();
        setArt();
        setReady(false);
  
      };

    }

  }, [username, slug]);

  return (
    <section id={styles.viewer} className={!open ? styles.closed : null}>
      {ready && (
        <>
          <section id={styles.content}>
            <section id={styles["image-background"]} onClick={() => onClose(username)}>
              <img src={art.imagePath ? `https://cdn.makuwro.com/${art.imagePath}` : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/YouTube_loading_symbol_3_%28transparent%29.gif/640px-YouTube_loading_symbol_3_%28transparent%29.gif"} onClick={(event) => event.stopPropagation()} />
            </section>
            <section id={styles.artist}>
              <img src={`https://cdn.makuwro.com/${owner.avatarPath}`} />
              <h1>
                {owner.displayName || `@${owner.username}`}
              </h1>
              {owner.displayName && (
                <h2>
                  @{owner.username}
                </h2>
              )}
              <Link to={`/${owner.username}/terms`}>Terms of use</Link>
              <Link to="?action=report-abuse">Report</Link>
            </section>
          </section>
          <section id={styles.right}>
            <section id={styles.details} className={commentsOpen ? styles.closed : null}>
              <section id={styles.metadata}>
                <p>{art.description}</p>
                <dl>
                  {art.collaborators && art.collaborators[0] && (
                    <>
                      <dt>Collaborators</dt>
                      <dd>{art.collaborators}</dd>
                    </>
                  )}
                  {art.characters && art.characters[0] && (
                    <>
                      <dt>Characters</dt>
                      <dd><Link to="/Christian/characters/Sudobeast">Sudobeast</Link></dd>
                    </>
                  )}
                  {art.folders && art.folders[0] && (
                    <>
                      <dt>Folders</dt>
                      <dd><Link to="/Christian/folders/personas">Personas</Link></dd>
                    </>
                  )}
                  {art.worlds && art.worlds[0] && (
                    <>
                      <dt>Folders</dt>
                      <dd><Link to="/Christian/folders/personas">Personas</Link></dd>
                    </>
                  )}
                  <dt>Uploaded on</dt>
                  <dd>{art.uploadedOn}</dd>
                </dl>
              </section>
              <section id={styles.actions}>
                <button id={styles.like} className={!commentsEnabled ? styles.disabled : null} onClick={null}>Like</button>
                <button id={styles["show-comments"]} className={!commentsEnabled ? styles.disabled : null} onClick={commentsEnabled ? () => toggleComments(true) : null}>{commentsEnabled ? "Comments (0)" : "Comments disabled"}</button>
              </section>
            </section>
            <section id={styles["comment-container"]}>
              <form id={styles["comment-creator"]} className={commenting ? styles.commenting : null}>
                <textarea placeholder="Say something nice!"></textarea>
                <input type="submit" value="Comment" disabled />
              </form>
              <ul id={styles.comments}>
                {comments}
              </ul>
              <button onClick={() => toggleComments(false)}>Close comments</button>
            </section>
          </section>
        </>
      )}
    </section>
  );

}

ArtViewer.propTypes = {
  open: PropTypes.bool,
  currentUser: PropTypes.object,
  username: PropTypes.string,
  id: PropTypes.string,
  onClose: PropTypes.func
};