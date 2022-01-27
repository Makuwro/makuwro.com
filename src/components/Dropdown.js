import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Dropdown.module.css";
import PropTypes from "prop-types";

export default function Dropdown({defaultIndex, children, onChange, width}) {

  const dropdownRef = useRef();
  const [option, setOption] = useState();
  const [open, setOpen] = useState(false);
  const [above, setAbove] = useState(false);
  const [childrenComponents, setChildrenComponents] = useState();
  const [index, setIndex] = useState(defaultIndex);

  function checkIfFlipNeeded() {

    const rect = dropdownRef.current.getBoundingClientRect();
    setOpen(!open);
    setAbove(rect.bottom > window.innerHeight);

  }

  useEffect(() => {

    // Create and store the child components
    setChildrenComponents(React.Children.map(children, (child, childIndex) => {

      let newProps;

      if (childIndex === index) {
        
        setOption(child.props.children);

      }

      newProps = {
        ...child,
        props: undefined,
        _owner: undefined,
        _store: undefined,
        type: undefined,
        key: childIndex,
        className: childIndex === index ? styles.selected : null,
        onClick: () => {
    
          if (childIndex !== index) {
            
            setOption(child.props.children);
            setIndex(childIndex);
            
            if (onChange) {
              
              onChange(childIndex);

            }

          }

          setOpen(false);
          setAbove(false);
          
        }
      };

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
    <section className={`${styles.list} ${!open ? styles.closed : ""} ${above ? styles.above : ""}`} ref={dropdownRef}>
      <section style={{
        width: width || "auto"
      }} onClick={() => checkIfFlipNeeded()}>
        {children ? (option || "Choose from a list...") : "No options available"}
      </section>
      <ul>{childrenComponents}</ul>
    </section>
  );

}

Dropdown.propTypes = {
  defaultIndex: PropTypes.number,
  children: PropTypes.node,
  onChange: PropTypes.func,
  width: PropTypes.number
};