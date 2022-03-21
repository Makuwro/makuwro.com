import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "../styles/Popup.module.css";
import { useNavigate } from "react-router-dom";

export default function Popup({title, children, onClose, open, warnUnfinished, notify, width}) {

  const [newChildren, setNewChildren] = useState(null);
  const [cursorOverBG, setCursorOverBG] = useState(false);
  const [clickedInside, setClickedInside] = useState(false);
  const [closing, setClosing] = useState(true);
  const navigate = useNavigate();

  function close(bypass) {

    if (!warnUnfinished || ((bypass || (cursorOverBG && !clickedInside)) && confirm("Are you sure you want to exit? You aren't finished yet!"))) {

      setClosing(true);

    }

  }

  useEffect(() => {

    if (open) {

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

      setNewChildren(fixedChildren);

      document.addEventListener("keydown", checkForEscape);

      return () => {

        document.removeEventListener("keydown", checkForEscape);

      };

    }


  }, [children]);

  useEffect(() => {

    setTimeout(() => setClosing(!open), 0);

  }, [open]);

  return (
    <section 
      className={`${styles.background} ${!closing ? styles.open : ""}`} 
      onMouseDown={() => setClickedInside(false)} 
      onClick={() => close()} 
      onMouseOver={() => setCursorOverBG(true)} 
      onMouseOut={() => setCursorOverBG(false)}
      onTransitionEnd={() => {

        if (closing) {

          navigate(window.location.pathname + (location.hash ? `#${location.hash}` : ""));
          onClose();

        }

      }}
    >
      <section className={styles.container} 
        style={width ? {width} : null}
        onMouseDown={(event) => {
        
          setClickedInside(true);
          event.stopPropagation();
      
        }} 
        onClick={(event) => event.stopPropagation()} 
        onMouseOver={(event) => event.stopPropagation()} 
        onMouseOut={(event) => event.stopPropagation()}
        onTransitionEnd={(event) => {

          event.stopPropagation();

        }}
      >
        <section className={styles.header}>
          <h1>{title}</h1>
          <button onClick={() => close(true)}>🞫</button>
        </section>
        <section className={styles.content}>{newChildren}</section>
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