import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/Popup.module.css";

export default function Popup({visible, title, content}) {

  return visible ? (
    <section id={styles["popup-background"]}>
      <section id={styles["popup-container"]}>
        <section id={styles["popup-header"]}>
          <h1>{title}</h1>
        </section>
        <section id={styles["popup-content"]}>{content}</section>
      </section>
    </section>
  ) : null;

}

Popup.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.element
};