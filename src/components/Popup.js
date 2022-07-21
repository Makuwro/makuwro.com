import styles from "../styles/Popup.module.css";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function Popup({
  onClose, warnUnfinished, exitMessage = "Are you sure you want to exit? You aren't finished yet!", children,
  title, unclosable, className, options, open, ...props
}) {

  const [cursorOverBG, setCursorOverBG] = useState(false);
  const [clickedInside, setClickedInside] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [noLongerNeeded, setNoLongerNeeded] = useState(false);

  function close(bypass) {

    if (!unclosable && (bypass || ((cursorOverBG && !clickedInside)) && (!warnUnfinished || confirm(exitMessage)))) {

      setNoLongerNeeded(true);
      setPopupOpen(false);

    }

  }

  useEffect(() => {

    if (open) {

      // Initialize the popup.
      const checkForEscape = ({key}) => {

        if (key === "Escape") {

          close();

        }

      };

      // Open this popup.
      setTimeout(() => setPopupOpen(true), 0);

      // Listen for keydown.
      document.addEventListener("keydown", checkForEscape);

      return () => {

        document.removeEventListener("keydown", checkForEscape);

      };

    } else {

      setPopupOpen(false);

    }

  }, [open]);

  return (
    <section 
      className={`${styles.background} ${popupOpen ? styles.open : ""}`} 
      onMouseDown={() => setClickedInside(false)} 
      onClick={(event) => {
        event.stopPropagation();
        close();
      }} 
      onMouseOver={() => setCursorOverBG(true)} 
      onMouseOut={() => setCursorOverBG(false)}
      onTransitionEnd={() => {

        if (!popupOpen && noLongerNeeded) {

          if (onClose) {

            onClose();
      
          }

        }

      }}>
      <section className={styles.container}
        onMouseDown={(event) => {
        
          setClickedInside(true);
          event.stopPropagation();
      
        }} 
        onClick={(event) => event.stopPropagation()} 
        onMouseOver={(event) => event.stopPropagation()} 
        onMouseOut={(event) => event.stopPropagation()}
        onTransitionEnd={(event) => {

          // Stop this event from prematurely closing the popup.
          event.stopPropagation();

        }}
      >
        <section className={styles.header}>
          {title && (
            <h1>{title}</h1>
          )}
          {!unclosable && (
            <button onClick={() => close(true)}>
              <span className="material-icons-round">
                close
              </span>
            </button>
          )}
        </section>
        <section {...props} className={`${styles.content}${className ? ` ${className}` : ""}`}>{children}</section>
        {options && (
          <section className={styles.options}>
            {options}
          </section>
        )}
      </section>
    </section>
  );

}

Popup.propTypes = {
  onClose: PropTypes.func,
  warnUnfinished: PropTypes.bool,
  exitMessage: PropTypes.string,
  children: PropTypes.object,
  title: PropTypes.string,
  unclosable: PropTypes.bool,
  className: PropTypes.string
};