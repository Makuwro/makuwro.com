import React, { useEffect, useState } from "react";
import styles from "../../../styles/LibraryViewer.module.css";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Comment from "../../Comment";
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function ArtViewer({art, open, currentUser, onClose, notify, artRegex, confirmContentWarning, contentWarningStatus, artDeleted}) {

  let [comments, setComments] = useState();
  const [commentComps, setCommentComps] = useState([]);
  const [commentsOpen, toggleComments] = useState(false);
  const [commentsEnabled, toggleCommentsEnabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [characterComps, setCharacterComps] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [ready, setReady] = useState(false);
  const [formattedDate, setFormattedDate] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    if (art && !art.refresh) {

      document.title = `${art.owner.username}: ${art.description} / Makuwro`;

    }

  }, [open]);

  useEffect(async () => {

    if (art && !art.refresh) {

      const date = new Date(art.uploadedOn);
      const {characters, collaborators} = art;
      let comps;
      let i;

      // Fix the collaborators
      comps = [];
      for (i = 0; collaborators.length > i; i++) {

        const collaborator = collaborators[i];
        comps[i] = <Link 
          to={`/${collaborator.username}`} 
          key={collaborator.id}
        >
          {collaborator.displayName || `@${collaborator.username}`}
        </Link>;

      }
      setCollaborators(comps);

      // Fix the characters.
      comps = [];
      for (i = 0; (characters?.length || 0) > i; i++) {

        const character = characters[i];
        comps[i] = <>{i !== 0 && i + 1 === characters.length ? " and " : ""}<Link 
          to={`/${character.owner.username}/characters/${character.slug}`} 
          key={character.id}
        >
          {character.name}
        </Link></>;

      }
      setCharacterComps(comps);

      if (art.contentWarning) {

        confirmContentWarning(art.contentWarning);

      }
      
      setFormattedDate(`${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`);
      setReady(true);

    }

    return () => {

      setReady(false);

    };

  }, [art]);

  useEffect(async () => {

    if (!comments && art) {

      // Get the comments
      try {

        const response = await fetch(`${process.env.RAZZLE_API_DEV}contents/art/${art.owner.username}/${art.slug}/comments`, {headers: {
          token: currentUser.token
        }});

        const comments = await response.json();
        if (response.ok) {

          setComments(comments);

        } else {

          setComments([]);
          notify({
            title: "Couldn't get comments",
            children: comments.message
          });

        }

      } catch (err) {

        setComments([]);
        notify({
          title: "Couldn't get comments",
          children: err.message
        });

      }

    }

    if (comments) {

      const newComps = [];
      for (let i = comments.length - 1; i >= 0; i--) {

        const comment = comments[i];
        newComps.push(<Comment name={comment.owner.displayName} username={comment.owner.username} avatarPath={comment.owner.avatarPath} key={comment.id}>{comment.content}</Comment>);

      }
      setCommentComps(newComps);

    }

  }, [art, comments, currentUser]);

  async function deleteArt() {

    const sure = confirm("Are you sure you want to delete this art? If it has unresolved reports, it'll be hidden from everyone, but not deleted until the reports are resolved by Makuwro Safety & Security.");

    if (sure) {

      try {

        const response = await fetch(`${process.env.RAZZLE_API_DEV}contents/art/${art.owner.username}/${art.slug}`, {headers: {
          token: currentUser.token
        }, method: "DELETE"});

        if (response.ok) {

          notify({
            title: "Successfully deleted your art",
            children: "Buh-bye!"
          });
          artDeleted();
          navigate(`/${art.owner.username}/art`);

        }

      } catch (err) {

        notify({
          title: "Couldn't delete your art",
          children: err.message
        });

      }

    }

  }

  async function submitComment(event) {

    // Don't refresh the page please!
    event.preventDefault();

    if (!submitting) {

      setSubmitting(true);

      try {

        const formData = new FormData();
        formData.append("content", commentContent);

        const response = await fetch(`${process.env.RAZZLE_API_DEV}contents/art/${art.owner.username}/${art.slug}/comments`, {
          headers: {
            token: currentUser.token,
          }, 
          method: "POST",
          body: formData
        });

        if (response.ok) {

          // Refresh the comments
          setCommentContent("");
          setComments();

        }

      } catch (err) {

        notify({
          title: "Couldn't submit your comment",
          children: err.message
        });

      }

      setSubmitting(false);

    }

  }

  return ready ? (
    <section id={styles.viewer} className={!open ? styles.closed : null} onTransitionEnd={() => {

      if (!open) {

        onClose(art.owner.username);

      }

    }}>
      {(!art || !art.refresh) && art && (
        <>
          <section id={styles.content}>
            <section id={styles["image-background"]} onClick={() => navigate(`/${art.owner.username}/art`)}>
              <img src={art.imagePath ? `https://cdn.makuwro.com/${art.imagePath}` : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/YouTube_loading_symbol_3_%28transparent%29.gif/640px-YouTube_loading_symbol_3_%28transparent%29.gif"} onClick={(event) => event.stopPropagation()} />
            </section>
            <section id={styles.artist}>
              <img src={`https://cdn.makuwro.com/${art.owner.avatarPath}`} />
              <h1>
                {art.owner.displayName || `@${art.owner.username}`}
              </h1>
              {art.owner.displayName && (
                <h2>
                  @{art.owner.username}
                </h2>
              )}
              <Link to={`/${art.owner.username}/terms`}>Terms of use</Link>
              <Link to="?action=report-abuse">Report</Link>
            </section>
          </section>
          <section id={styles.right}>
            <section id={styles.details} className={commentsOpen ? styles.closed : null}>
              <section id={styles.metadata}>
                <p>{art.description}</p>
                <dl>
                  {collaborators[0] && (
                    <>
                      <dt>Collaborators</dt>
                      <dd>{collaborators}</dd>
                    </>
                  )}
                  {characterComps[0] && (
                    <>
                      <dt>Characters</dt>
                      <dd>{characterComps}</dd>
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
                  <dd>{formattedDate}</dd>
                </dl>
              </section>
              <section id={styles.actions}>
                <button id={styles.like} className={!commentsEnabled ? styles.disabled : null} onClick={null}>Like</button>
                <button id={styles["show-comments"]} className={!commentsEnabled ? styles.disabled : null} onClick={commentsEnabled ? () => toggleComments(true) : null}>{commentsEnabled ? "Comments" : "Comments disabled"}</button>
                {currentUser.id === art.owner.id && (
                  <>
                    <button onClick={() => navigate("?action=edit-art")}>Edit</button>
                    <button className="destructive" onClick={deleteArt}>Delete</button>
                  </>
                )}
              </section>
            </section>
            <section id={styles["comment-container"]}>
              {currentUser.id && (
                <form id={styles["comment-creator"]} onSubmit={submitComment}>
                  <img src={`https://cdn.makuwro.com/${currentUser.avatarPath}`} />
                  <section>
                    <section id={styles.commentNames}>
                      {currentUser.displayName && (
                        <section>{currentUser.displayName}</section>
                      )}
                      <section className={styles.username}>@{currentUser.username}</section>
                    </section>
                    <textarea placeholder="This is cool!" required value={commentContent} onInput={(event) => setCommentContent(event.target.value)} />
                    <input type="submit" value="Post" disabled={submitting} />
                  </section>
                </form>
              )}
              <ul id={styles.comments}>
                {commentComps}
              </ul>
              <button onClick={() => toggleComments(false)}>Close comments</button>
            </section>
          </section>
        </>
      )}
    </section>
  ) : null;

}

ArtViewer.propTypes = {
  open: PropTypes.bool,
  currentUser: PropTypes.object,
  art: PropTypes.object,
  onClose: PropTypes.func,
  notify: PropTypes.func,
  artRegex: PropTypes.object
};