import React from "react";
import styles from "../styles/Comment.module.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function Comment({displayName, username, ownerId, children}) {

  return (
    <li className={styles.comment}>
      <Link to={`/${username}`} className={styles.avatar}>
        <img src={`https://cdn.makuwro.com/${ownerId}/avatar`} />
      </Link>
      <section>
        <h1 className={styles.displayName}>{displayName}</h1>
        <section className={styles.content}>
          {children}
        </section>
      </section>
    </li>
  );

}

Comment.propTypes = {
  name: PropTypes.string,
  username: PropTypes.string,
  avatarUrl: PropTypes.string,
  children: PropTypes.node.isRequired
}