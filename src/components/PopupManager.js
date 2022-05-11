import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "../styles/Popup.module.css";
import { useNavigate } from "react-router-dom";

export default function PopupManager({notify, popupsChanged, popups = []}) {

  const [currentPopup, setCurrentPopup] = useState();
  const [cursorOverBG, setCursorOverBG] = useState(false);
  const [clickedInside, setClickedInside] = useState(false);
  const [closing, setClosing] = useState(2);
  const navigate = useNavigate();

  function close(bypass) {

    if (!currentPopup?.warnUnfinished || ((bypass || (cursorOverBG && !clickedInside)) && confirm(currentPopup?.exitMessage || "Are you sure you want to exit? You aren't finished yet!"))) {

      if (currentPopup.onClose) {

        currentPopup.onClose();
  
      }

      setClosing(popups[1] ? 1 : 2);
      popupsChanged(() => {

        const newPopups = [...popups];
        newPopups.shift();
        return newPopups;

      });

    }

  }

  useEffect(() => {

    if (popups[0]) {

      const {children} = popups[0];

      const fixedChildren = React.Children.map(children, (child) => {

        if (React.isValidElement(child)) {

          return React.cloneElement(child, {notify});

        }

        return child;

      });

      const checkForEscape = ({keyCode}) => {

        if (keyCode === 27) {

          close();

        }

      };

      setCurrentPopup({
        ...popups[0],
        children: fixedChildren
      });

      document.addEventListener("keydown", checkForEscape);

      return () => {

        document.removeEventListener("keydown", checkForEscape);

      };

    }

  }, [popups]);

  useEffect(() => {

    if (currentPopup) {

      setTimeout(() => setClosing(0), 0);

    }

  }, [currentPopup]);

  return currentPopup ? (
    <section 
      className={`${styles.background} ${closing !== 2 ? styles.open : ""}`} 
      onMouseDown={() => setClickedInside(false)} 
      onClick={() => close()} 
      onMouseOver={() => setCursorOverBG(true)} 
      onMouseOut={() => setCursorOverBG(false)}
      onTransitionEnd={() => {

        if (closing === 2) {

          setCurrentPopup();
          navigate(window.location.pathname + (location.hash ? `#${location.hash}` : ""));

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
          {currentPopup?.title && (
            <h1>{currentPopup.title}</h1>
          )}
          {!currentPopup?.unclosable && (
            <button onClick={() => close(true)}>🞫</button>
          )}
        </section>
        <section className={styles.content}>{currentPopup.children}</section>
      </section>
    </section>
  ) : null;

}

PopupManager.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func,
  warnUnfinished: PropTypes.bool,
  popups: PropTypes.array
};