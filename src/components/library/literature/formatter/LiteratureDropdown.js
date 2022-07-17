import React, { useState, useEffect } from "react";
import styles from "../../../../styles/Literature.module.css";
import PropTypes from "prop-types";

export default function LiteratureDropdown({children, open, onChange}) {

  const [newChildren, setNewChildren] = useState(null);

  useEffect(() => {

    setNewChildren(() => {

      return React.Children.map(children, (child, index) => React.cloneElement(child, { onClick: (event) => {
      
        event.stopPropagation();
        onChange(index); 
      
      }}));

    });

  }, [children]);

  return (
    <section className={`${styles.dropdownMenu}${open ? ` ${styles.open}` : ""}`}>
      {newChildren}
    </section>
  );

}

LiteratureDropdown.propTypes = {
  children: PropTypes.any,
  open: PropTypes.bool,
  onChange: PropTypes.func
};