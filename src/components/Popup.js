import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import styles from "../styles/Popup.module.css";
import { useNavigate } from "react-router-dom";

export default function Popup({title, children, queried}) {

  const navigate = useNavigate();
  let [open, setOpen] = useState(false);
  let [initialOpen, setInitialOpen] = useState();

  // Let the popup mount, then show the open animation
  useEffect(() => {

    // We're only doing this once
    if (!initialOpen) {

      setInitialOpen(true);

      // Using setTimeout so the open animation is still shown
      setTimeout(() => {

        setOpen(true);

      }, 0);

    }

  }, [open, initialOpen]);

  return (
    <section id={styles["popup-background"]} className={open ? styles.open : null} onClick={() => {

      setOpen(false);
      if (queried) setTimeout(() => navigate(window.location.pathname + (location.hash ? `#${location.hash}` : ""), {replace: true}), 300);

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
  queried: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node.isRequired
};