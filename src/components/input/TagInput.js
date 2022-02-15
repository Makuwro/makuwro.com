import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/TagInput.module.css";

export default function TagInput({children, onChange}) {

  const [phrase, setPhrase] = useState("");
  const inputRef = useRef();

  useEffect(() => {

    inputRef.current.focus();

  }, [phrase]);

  function checkSelection(event) {

    // Check if it was a tab or an enter
    if ((event.keyCode === 9 || event.keyCode === 13) && phrase) {

      onChange(tags => {

        let tag;

        // Check if the tag already exists
        if (tags.find((tag) => tag.key === phrase)) {

          alert("You already added that tag!");
          return tags;

        }

        // Create a new tag
        tag = (
          <span onClick={() => {

            onChange(tags => tags.filter((tag2) => tag2 !== tag));

          }} key={phrase}>
            {phrase}
          </span>
        );

        return [...tags, tag];

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
      {children}
      <input tabIndex="0" type="text" onKeyDown={checkSelection} value={phrase} onInput={(event) => setPhrase(event.target.value)} ref={inputRef} className={!children[0] ? styles.none : ""} />
    </section>
  );

}

TagInput.propTypes = {
  children: PropTypes.any,
  onChange: PropTypes.func
}