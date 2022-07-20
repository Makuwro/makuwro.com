import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Comment from "./Comment";
import styles from "../styles/Comment.module.css";

export default function Comments({client, content}) {

  const [ready, setReady] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentComponents, setCommentComponents] = useState([]);
  const [canSendComment, setCanSendComment] = useState(false);
  const [sendButtonPressed, setSendButtonPressed] = useState(false);
  const contentRef = useRef();

  useEffect(() => {

    (async () => {

      try {

        // Get the comments from the server.
        setComments(await content.getAllComments());

      } catch (err) {

        console.error(err);

      }

      // We're ready!
      setReady(true);

    })();

  }, []);

  useEffect(() => {

    // Convert the comment objects to Comment components.
    const commentComponents = [];
    for (let i = 0; comments.length > i; i++) {

      const comment = comments[i];
      commentComponents[i] = (
        <Comment 
          key={comment.id} 
          client={client} 
          object={comment} 
          onDelete={() => {

            const newComments = [...comments];
            newComments.splice(i, 1);
            setComments(newComments);

          }}
          onEdit={(newContent) => {

            const newComments = [...comments];
            newComments[i].content = newContent;
            setComments(newComments);

          }}/>
      );

    }

    // Reverse the comment order.
    commentComponents.reverse();

    // Save the components to the state.
    setCommentComponents(commentComponents);

  }, [comments]);

  useEffect(() => {

    (async () => {

      if (sendButtonPressed) {

        // Check if we can send the comment.
        if (canSendComment) {

          // This can throw an error, so let's catch it so the client won't crash.
          try {

            // Try to create the comment.
            const comment = await content.createComment(contentRef.current.textContent);

            // Reset the comment creator.
            contentRef.current.innerHTML = "";

            // Add the comment to the start of the list.
            const newComments = [...comments];
            newComments.unshift(comment);
            setComments(newComments);

          } catch (err) {

            alert(err);

          }

        }

        setSendButtonPressed(false);

      }

    })();

  }, [sendButtonPressed]);

  function checkForText(event) {

    // Check if there is text.
    if (event.target.textContent) {

      setCanSendComment(true);

    } else {

      setCanSendComment(false);

    }

  }

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
              suppressContentEditableWarning
              ref={contentRef}
              onKeyDown={checkForText}
              onKeyUp={checkForText} />
            <section id={styles.actions}>
              <section id={styles.formatter}>
                <button disabled>
                  <span className="material-icons-round">
                    image
                  </span>
                  <span className={styles.buttonText}>
                    Attach image
                  </span>
                </button>
              </section>
              <button 
                id={styles.send} 
                disabled={!canSendComment || sendButtonPressed}
                onClick={() => setSendButtonPressed(true)}>
                <span className="material-icons-round">
                  send
                </span>
                <span className={styles.buttonText}>
                  Post
                </span>
              </button>
            </section>
          </section>
        </section>
      )}
      {ready && (
        commentComponents[0] ? (
          <ul id={styles.comments}>
            {commentComponents}
          </ul>
        ) : (
          <p>
            Would you look at that: there's no comments!{client.user ? " The time is now." : ""}
          </p>
        )
      )}
    </section>
  );

}

Comments.propTypes = {
  client: PropTypes.object,
  content: PropTypes.object.isRequired
}