import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/TagInput.module.css";

export default function TagInput({children, onChange}) {

  const [childrenComponents, setChildrenComponents] = useState([]);
  const [phrase, setPhrase] = useState("");
  const inputRef = useRef();

  useEffect(() => {

    setChildrenComponents(React.Children.map(children, (child) => {

      return <span onClick={() => {

        onChange(tags => tags.filter((tag2) => tag2 !== child));

      }} key={child}>
        {child}
      </span>;

    }));

  }, [children]);

  function checkSelection(event) {

    // Check if it was a tab or an enter
    if ((event.keyCode === 9 || event.keyCode === 13) && phrase) {

      event.preventDefault();
      onChange(tags => {

        // Check if the tag already exists
        if (tags.find((tag) => tag === phrase)) {

          alert("You already added that tag!");
          return tags;

        }

        return [...tags, phrase];

      });
      setPhrase("");

    } else if (event.keyCode === 8 && inputRef.current.selectionStart === 0 && children[0]) {

      // Check if there's anything
      onChange(tags => {

        const tagsCopy = [...tags];
        tagsCopy.pop();
        return tagsCopy;

      });

    }

  }

  return (
    <section className={styles.tagInput} onClick={() => inputRef.current.focus()}>
      {childrenComponents}
      <input 
        tabIndex="0" 
        type="text" 
        onKeyDown={checkSelection} 
        value={phrase} 
        ref={inputRef}
        className={!children || !children[0] ? styles.none : ""}
        onInput={(event) => setPhrase(event.target.value)} 
      />
    </section>
  );

}

TagInput.propTypes = {
  children: PropTypes.any,
  onChange: PropTypes.func
};