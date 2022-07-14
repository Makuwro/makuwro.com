import styles from "../../styles/Popup.module.css";
import React, { useState, useEffect, useContext } from "react";
import { PopupContext } from "./PopupManager";
import PropTypes from "prop-types";

export default function Popup({
  onClose, warnUnfinished, exitMessage = "Are you sure you want to exit? You aren't finished yet!", children,
  title, unclosable, className, ...props
}) {

  const [previousPopup, setPreviousPopup] = useState();
  const [cursorOverBG, setCursorOverBG] = useState(false);
  const [clickedInside, setClickedInside] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const {currentPopup, setCurrentPopup} = useContext(PopupContext);
  const [noLongerNeeded, setNoLongerNeeded] = useState(false);

  function close(bypass) {

    if (!unclosable && (bypass || ((cursorOverBG && !clickedInside)) && (!warnUnfinished || confirm(exitMessage)))) {

      setNoLongerNeeded(true);
      setPopupOpen(false);

    }

  } 

  useEffect(() => {

    // Initialize the popup.
    const checkForEscape = ({keyCode}) => {

      if (keyCode === 27) {

        close();

      }

    };

    // Check if there's currently a popup.
    if (currentPopup) {

      // Temporarily close that popup, but save it.
      currentPopup.toggle(false);
      setPreviousPopup(currentPopup);

    }

    // Set this popup as the current popup, just in case another popup shows up.
    setCurrentPopup({
      toggle: (open) => setPopupOpen(open)
    });

    // Open this popup.
    setTimeout(() => setPopupOpen(true), 0);

    // Listen for keydown.
    document.addEventListener("keydown", checkForEscape);

    return () => {

      document.removeEventListener("keydown", checkForEscape);

    };

  }, []);

  return (
    <section 
      className={`${styles.background} ${popupOpen ? styles.open : ""}`} 
      onMouseDown={() => setClickedInside(false)} 
      onClick={() => close()} 
      onMouseOver={() => setCursorOverBG(true)} 
      onMouseOut={() => setCursorOverBG(false)}
      onTransitionEnd={() => {

        if (!popupOpen && noLongerNeeded) {

          if (previousPopup) {
    
            previousPopup.toggle(true);
            
          }

          if (onClose) {

            onClose();
      
          }

        }

      }}
    >
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