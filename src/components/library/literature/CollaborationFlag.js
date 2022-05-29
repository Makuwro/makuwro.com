import React from "react";
import PropTypes from "prop-types";
import styles from "../../../styles/Blog.module.css";

export default function CollaborationFlag({username, ...props}) {

  return (
    <span {...props} className={styles.flag}>
      <span className={styles.flagOwner}>{username}</span>
      <span className={styles.flagStick}></span>
    </span>
  );

}

CollaborationFlag.propTypes = {
  username: PropTypes.string.isRequired
};