import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Comment from "./Comment";
import styles from "../styles/Comment.module.css";

export default function Comments({client, content}) {

  const [ready, setReady] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {

    (async () => {

      try {

        // Get the comments from the server.
        const comments = await content.getAllComments();

        // Convert the comment objects to Comment components.
        for (let i = 0; comments.length > i; i++) {

          const comment = comments[i];
          comments[i] = (
            <Comment
              displayName={comment.owner.displayName}
              username={comment.owner.username}
              ownerId={comment.owner.id}>
              {comment.content}
            </Comment>
          );

        }

        // Save the components to the state.
        setComments(comments);

      } catch (err) {

        console.error(err);

      }

    })();

  }, []);

  return (
    <section id={styles.main}>
      {client.user && (
        <section id={styles.creator}>
          <img className={styles.avatar} src={`https://cdn.makuwro.com/${client.user.id}/avatar`} />
          <section>
            <h1 className={styles.displayName}>{client.user.displayName || `@${client.user.username}`}</h1>
            <section 
              placeholder="This looks really cool!"
              className={styles.content}
              contentEditable 
              suppressContentEditableWarning />
          </section>
        </section>
      )}
      {comments[0] ? (
        <ul className={styles.comments}>
          {comments}
        </ul>
      ) : (
        <p>
          Would you look at that: there's no comments!{client.user ? " The time is now." : ""}
        </p>
      )}
    </section>
  );

}

Comments.propTypes = {
  client: PropTypes.object,
  content: PropTypes.object.isRequired
}