import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/Popup.module.css";
import { useNavigate } from "react-router-dom";

export default function Popup({title, children, onClose, open, warnUnfinished}) {

  const navigate = useNavigate();

  return (
    <section id={styles["popup-background"]} className={open ? styles.open : null} onClick={() => {

      if (!warnUnfinished || confirm("Are you sure you want to exit? You aren't finished yet!")) {

        navigate(window.location.pathname + (location.hash ? `#${location.hash}` : ""));
        onClose();

      }

    }}>
      <section id={styles["popup-container"]} onClick={(event) => event.stopPropagation()}>
        <section id={styles["popup-header"]}>
          <h1>{title}</h1>
        </section>
        <section id={styles["popup-content"]}>{children}</section>
      </section>
    </section>
  );

}

Popup.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func,
  warnUnfinished: PropTypes.bool
};