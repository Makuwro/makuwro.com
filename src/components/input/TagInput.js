import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/TagInput.module.css";

export default function TagInput({children, onChange, tags}) {

  const [childrenComponents, setChildrenComponents] = useState([]);
  const [phrase, setPhrase] = useState("");
  const inputRef = useRef();

  useEffect(() => {

    // Iterate through the tag names.
    const childrenComponents = [];
    for (let i = 0; tags.length > i; i++) {

      // Add a clickable tag component.
      const tag = tags[i];
      childrenComponents.push(
        <span onClick={() => onChange(tags.filter((tag2) => tag2 !== tag))} key={tag}>
          {tag}
        </span>
      );

    }

    // Add the tags as React components.
    setChildrenComponents(childrenComponents);

  }, [tags]);

  function checkSelection(event) {

    // Check if it was a tab or an enter
    if ((event.keyCode === 9 || event.keyCode === 13) && phrase) {

      event.preventDefault();

      // Check if the tag already exists.
      if (tags.find((tag) => tag === phrase)) {

        alert("You already added that tag!");

      } else {

        // Add the tag to the list.
        onChange([...tags, phrase]);

        // Reset the tag input.
        setPhrase("");

      }

    } else if (event.keyCode === 8 && inputRef.current.selectionStart === 0 && children[0]) {

      // Pop the last tag from the list.
      const tagsCopy = [...tags];
      tagsCopy.pop();

      // Save the changes.
      onChange(tagsCopy);

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