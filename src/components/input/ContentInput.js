import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/TagInput.module.css";
import ddStyles from "../../styles/Dropdown.module.css";

export default function ContentInput({content, onChange, currentUser, type}) {

  const typeList = ["users", "folders", "worlds", "characters"];
  const [phrase, setPhrase] = useState("");
  const [selectedUser, setSelectedUser] = useState();
  const [searchResults, setSearchResults] = useState(null);
  const [childrenComponents, setChildrenComponents] = useState([]);
  const [cache, setCache] = useState({});
  const inputRef = useRef();
  const inputContainerRef = useRef();

  useEffect(() => {

    const comps = [];

    for (let i = 0; (content?.length || 0) > i; i++) {

      comps[i] = <span onClick={() => {
    
        onChange(() => content.filter((item2) => item2 !== content[i]));

      }} key={content[i].id}>
        <img src={`https://cdn.makuwro.com/${content[i].avatarPath || content[i].imagePath}`} />
        {content[i].name || content[i].displayName || `@${content[i].username}`}
      </span>;

    }

    if (comps.length !== childrenComponents.length) {

      inputRef.current.focus();

    }

    setChildrenComponents(comps);

  }, [content]);

  useEffect(() => {

    let mounted = true;
    if (phrase) {

      const checkForItems = (callback) => {

        let items = cache[phrase];
        if (items) {

          // It's in the cache, so let's use that!
          callback(items);

        } else {

          // Set a timeout just in case we're still typing!
          // Take your time :)
          setTimeout(async () => {
      
            // If the component is gone, no need to query the API and get rate-limited.
            if (!mounted) {

              return;

            }

            try {

              // Search for this content.
              const response = await fetch(`${process.env.RAZZLE_API_DEV}${type !== 0 ? `contents/search?type=${typeList[type]}&username=${currentUser.username}&name=${encodeURIComponent(phrase)}` : `accounts/users/${phrase}`}`, {
                headers: {
                  token: currentUser.token
                }
              });

              if (response.ok) {

                // Add the content to the cache so that we don't have to ask the server again.
                items = await response.json();
                if (type === 0) items = [items];
                setCache((oldCache) => {

                  const newCache = {...oldCache};
                  newCache[phrase] = items;
                  return newCache;

                });

              }
              
              // And now, back to our regularly scheduled function.
              callback(items);

            } catch (err) {

              alert(`Couldn't search for content: ${err.message}`);
              console.warn(err.stack);

            }
      
          }, 1000);

        }

      };

      checkForItems((items) => {

        const results = [];
        for (let i = 0; items.length > i; i++) {

          const item = items[i];
          results[i] = (
            <li 
              key={item.id} 
              onClick={() => {

                onChange(() => {

                  // Check if the user already exists
                  if (content.find((item2) => item2.id === item.id)) {

                    alert("You already added that one!");
                    return content;

                  } else if (type === 0 && item.id === currentUser.id) {

                    alert("You can't add yourself!");
                    return content;

                  }

                  return [...content, item];

                });
                setSearchResults(null);
                setPhrase("");

              }}
            >
              <img src={`https://cdn.makuwro.com/${item.avatarPath || item.imagePath}`} />
              {item.name || item.displayName || item.username}
            </li>
          );

        }

        setSearchResults(results);

      });

    } else {

      setSearchResults(null);

    }

    return () => {

      mounted = false;

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

    } else if (event.keyCode === 8 && inputRef.current.selectionStart === 0 && content[0]) {

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
        <input tabIndex="0" type="text" onKeyDown={checkSelection} value={phrase} onInput={(event) => setPhrase(event.target.value)} ref={inputRef} className={!(content || [])[0] ? styles.none : ""} />
      </section>
      <ul>
        {searchResults && !searchResults[0] && <li className={styles.message}>No results found :(</li>}
        {searchResults}
      </ul>
    </section>
  );

}

ContentInput.propTypes = {
  content: PropTypes.any,
  onChange: PropTypes.func,
  currentUser: PropTypes.object.isRequired,
  type: PropTypes.number.isRequired
};