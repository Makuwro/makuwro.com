import React, { useState, useRef } from "react";
import styles from "../styles/Comment.module.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function Comment({client, object, onDelete, onEdit}) {

  const [editing, setEditing] = useState(false);
  const contentRef = useRef();

  async function editComment() {

    try {

      // Check if the text content is the same.
      const newText = contentRef.current.textContent;
      if (newText.trim() !== object.content.trim()) {

        // Request the server to update the comment.
        await object.update({
          content: newText
        });

        // Tell the component's parent that we updated the comment.
        onEdit(newText);

      }

      // Everything's back to normal.
      setEditing(false);

    } catch (err) {

      console.error(err);

    }
    
  }

  async function deleteComment() {

    if (confirm("Are you sure you want to delete this comment?")) {
      
      await object.delete();
      onDelete();

    }

  }

  const isOwner = client.user?.id === object.owner.id;
  const isTopicOwner = false;

  return (
    <li className={styles.commentContainer}>
      <section className={styles.actions}>
        {isOwner && (
          <button onClick={() => editing ? editComment() : setEditing(!editing)}>
            <span className="material-icons-round">
              {editing ? "save" : "edit"}
            </span>
          </button>
        )}
        {(isOwner || isTopicOwner) && (
          <button onClick={deleteComment}>
            <span className="material-icons-round">
              delete
            </span>
          </button>
        )}
        {!isOwner && (
          <button>
            <span className="material-icons-round">
              flag
            </span>
          </button>
        )}
      </section>
      <section className={styles.comment}>
        <Link to={`/${object.owner.username}`} className={styles.avatar}>
          <img src={`https://cdn.makuwro.com/${object.owner.id}/avatar`} />
        </Link>
        <section>
          <h1 className={styles.displayName}>{object.owner.displayName}</h1>
          <section 
            className={styles.content} 
            contentEditable={editing}
            ref={contentRef}
            suppressContentEditableWarning>
            {object.content}
          </section>
        </section>
      </section>
    </li>
  );

}

Comment.propTypes = {

}