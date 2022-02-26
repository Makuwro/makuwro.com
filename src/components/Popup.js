import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "../styles/Popup.module.css";
import { useNavigate } from "react-router-dom";

export default function Popup({title, children, onClose, open, warnUnfinished, notify}) {

  const [newChildren, setNewChildren] = useState(null);
  const [cursorOverBG, setCursorOverBG] = useState(false);
  const [clickedInside, setClickedInside] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    const fixedChildren = React.Children.map(children, (child) => {

      if (React.isValidElement(child)) {

        return React.cloneElement(child, {notify});

      }

      return child;

    });

    setNewChildren(fixedChildren);

  }, [children]);

  function close(bypass) {

    if ((bypass || (cursorOverBG && !clickedInside)) && confirm("Are you sure you want to exit? You aren't finished yet!")) {

      navigate(window.location.pathname + (location.hash ? `#${location.hash}` : ""));
      onClose();

    }

  }

  return (
    <section className={`${styles.background} ${open ? styles.open : ""}`} onMouseDown={() => setClickedInside(false)} onClick={() => close()} onMouseOver={() => setCursorOverBG(true)} onMouseOut={() => setCursorOverBG(false)}>
      <section className={styles.container} onMouseDown={(event) => {
        
        setClickedInside(true);
        event.stopPropagation();
      
      }} onClick={(event) => event.stopPropagation()} onMouseOver={(event) => event.stopPropagation()} onMouseOut={(event) => event.stopPropagation()}>
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