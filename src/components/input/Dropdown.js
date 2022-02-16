import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/Dropdown.module.css";
import PropTypes from "prop-types";

export default function Dropdown({index, children, onChange, width, inPopup, tabIndex, text}) {

  const dropdownRef = useRef();
  const [open, setOpen] = useState(false);
  const [above, setAbove] = useState(false);
  const [childrenComponents, setChildrenComponents] = useState();

  function checkIfFlipNeeded() {

    const rect = dropdownRef.current.getBoundingClientRect();
    setAbove(rect.bottom > (inPopup ? 560 : window.innerHeight));
    setOpen(!open);

  }

  useEffect(() => {

    // Create and store the child components
    setChildrenComponents(React.Children.map(children, (child, childIndex) => {

      let newProps;

      newProps = {
        ...child,
        key: childIndex,
        className: childIndex === index ? styles.selected : null,
        onClick: () => {
    
          if (childIndex !== index) {
            
            if (onChange) {
              
              onChange(childIndex, child.props.children);

            }

          }

          setOpen(false);
          setAbove(false);
          
        }
      };

      delete newProps.props;
      delete newProps._owner;
      delete newProps._store;
      delete newProps.type;

      newProps["$$typeof"] = undefined;

      return React.createElement(child.type, newProps, child.props.children);
  
    }));

    function checkIfClickedOutside(event) {

      const {current} = dropdownRef;
      if (current && !current.contains(event.target)) {

        // This is an outside click, so close the dropdown
        setOpen(false);

      }

    }

    document.addEventListener("click", checkIfClickedOutside, true);

    return () => {

      document.removeEventListener("click", checkIfClickedOutside, true);

    };

  }, [index]);

  return (
    <section className={`${styles.list} ${!open ? styles.closed : ""} ${above ? styles.above : ""} ${!childrenComponents ? styles.none : ""}`} ref={dropdownRef}>
      <section tabIndex={tabIndex || null} style={{
        width: width || "auto"
      }} onClick={() => children && checkIfFlipNeeded()}>
        {text || (childrenComponents ? ((childrenComponents[index] && childrenComponents[index].props.children) || "Choose from a list...") : "No options available")}
      </section>
      <ul>{childrenComponents}</ul>
    </section>
  );

}

Dropdown.propTypes = {
  index: PropTypes.number,
  children: PropTypes.node,
  onChange: PropTypes.func,
  width: PropTypes.number,
  inPopup: PropTypes.bool
};