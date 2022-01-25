import React from "react";
import styles from "../styles/Comment.module.css";
import PropTypes from "prop-types";

export default function Comment({name, username, avatarUrl, children}) {

  return (
    <li className={styles.comment}>
      <section className={styles.author}>
        <img src={avatarUrl} />
        <section>
          <h1 className={styles["display-name"]}>{name}</h1>
          <section className={styles.content}>
            {children}
          </section>
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