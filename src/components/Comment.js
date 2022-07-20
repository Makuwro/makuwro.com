import React from "react";
import styles from "../styles/Comment.module.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function Comment({client, object, onDelete}) {

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
          <button>
            <span className="material-icons-round">
              edit
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
          <section className={styles.content}>
            {object.content.text}
          </section>
        </section>
      </section>
    </li>
  );

}

Comment.propTypes = {

}