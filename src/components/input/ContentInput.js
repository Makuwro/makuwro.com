import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/TagInput.module.css";
import ddStyles from "../../styles/Dropdown.module.css";

export default function ContentInput({children = [], onChange, currentUser, type}) {

  const typeList = ["users", "folders", "worlds", "characters"];
  const [phrase, setPhrase] = useState("");
  const [selectedUser, setSelectedUser] = useState();
  const [searchResults, setSearchResults] = useState(null);
  const [childrenComponents, setChildrenComponents] = useState([]);
  const [cache, setCache] = useState();
  const inputRef = useRef();
  const inputContainerRef = useRef();

  useEffect(() => {

    const comps = [];
    
    for (let i = 0; children.length > i; i++) {

      const content = children[i];
      comps[i] = <span onClick={() => {
    
        onChange(contentList => contentList.filter((user2) => user2 !== content));

      }} key={content.id}>
        <img src={`https://cdn.makuwro.com/${content.avatarPath || content.imagePath}`} />
        {content.name || content.displayName || `@${content.username}`}
      </span>;

    }

    if (comps.length !== childrenComponents.length) {

      inputRef.current.focus();

    }

    setChildrenComponents(comps);

  }, [children]);

  useEffect(() => {

    const timeout = setTimeout(async () => {

      // Check if that user exists
      if (phrase) {

        try {

          let items = cache;

          if (!cache) {

            const response = await fetch(`${process.env.RAZZLE_API_DEV}${type !== 0 ? `contents/${typeList[type]}/${currentUser.username}` : `accounts/users/${phrase}`}`, {
              headers: {
                token: currentUser.token
              }
            });

            if (response.ok) {

              items = await response.json();
              setCache(items);

            }

          }
          
          if (items) {

            const results = [];
            for (let i = 0; items.length > i; i++) {

              const content = items[i];
              results[i] = <li key={content.id} onClick={() => {

                onChange(contentList => {
    
                  // Check if the user already exists
                  if (contentList.find((user2) => user2.id === content.id)) {
    
                    alert("You already added that one!");
                    return contentList;
    
                  } else if (type === 0 && content.id === currentUser.id) {
    
                    alert("You can't add yourself");
                    return contentList;
    
                  }

                  return [...contentList, content];
    
                });
                setSearchResults(null);
                setPhrase("");

              }}>
                <img src={`https://cdn.makuwro.com/${content.avatarPath || content.imagePath}`} />
                {content.name || content.displayName || content.username}
              </li>;

            }

            setSearchResults(results);

          }

        } catch (err) {

          alert(`Couldn't search for content: ${err.message}`);
          console.warn(err.stack);

        }

      }

    }, 1000);

    return () => {

      clearTimeout(timeout);

    };

  }, [phrase]);

  useEffect(() => {

    function checkIfClickedOutside(event) {

      const {current} = inputContainerRef;
      if (current && !current.contains(event.target)) {

        // This is an outside click, so close the dropdown
        setSearchResults(null);

      }

    }

    document.addEventListener("click", checkIfClickedOutside, true);

    return () => {

      document.removeEventListener("click", checkIfClickedOutside, true);

    };

  }, []);

  function checkSelection(event) {

    // Check if it was a tab or an enter
    if ((event.keyCode === 9 || event.keyCode === 13) && selectedUser) {

      setSelectedUser();
      setPhrase("");

    } else if (event.keyCode === 8 && inputRef.current.selectionStart === 0 && children[0]) {

      // Check if there's anything
      onChange(users => {

        const usersCopy = [...users];
        usersCopy.pop();
        return usersCopy;

      });

    }

  }

  return (
    <section className={`${ddStyles.list} ${styles.container} ${searchResults ? styles.open : ""}`} ref={inputContainerRef} >
      <section className={styles.tagInput} onClick={() => inputRef.current.focus()}>
        {childrenComponents}
        <input tabIndex="0" type="text" onKeyDown={checkSelection} value={phrase} onInput={(event) => setPhrase(event.target.value)} ref={inputRef} className={!children[0] ? styles.none : ""} />
      </section>
      <ul>
        {searchResults}
      </ul>
    </section>
  );

}

ContentInput.propTypes = {
  children: PropTypes.any,
  onChange: PropTypes.func,
  currentUser: PropTypes.object.isRequired
};