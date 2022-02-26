import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/TagInput.module.css";
import ddStyles from "../../styles/Dropdown.module.css";

const userCache = {};
export default function UserInput({children, onChange, currentUser}) {

  const [phrase, setPhrase] = useState("");
  const [selectedUser, setSelectedUser] = useState();
  const [searchResults, setSearchResults] = useState(null);
  const [childrenComponents, setChildrenComponents] = useState([]);
  const inputRef = useRef();
  const inputContainerRef = useRef();

  useEffect(() => {

    setChildrenComponents(React.Children.map(children, (user) => {

      return <span onClick={() => {
    
        onChange(users => users.filter((user2) => user2 !== user));

      }} key={user.id}>
        <img src={`https://cdn.makuwro.com/${user.avatarPath}`} />
        {user.displayName || `@${user.username}`}
      </span>;

    }));

  }, [children]);

  useEffect(() => {

    inputRef.current.focus();
    const timeout = setTimeout(async () => {

      // Check if that user exists
      if (phrase) {

        try {

          let user;

          if (!userCache[phrase]) {

            const response = await fetch(`${process.env.RAZZLE_API_DEV}accounts/users/${phrase}`, {
              headers: {
                token: currentUser.token
              }
            });

            if (response.ok) {

              userCache[phrase] = await response.json();

            }

          }

          user = userCache[phrase];
          if (user) {

            setSearchResults(
              <li onClick={() => {

                onChange(users => {
    
                  // Check if the user already exists
                  if (users.find((user2) => user2.id === user.id)) {
    
                    alert("You already added that user!");
                    return users;
    
                  } else if (user.id === currentUser.id) {
    
                    alert("You can't add yourself");
                    return users;
    
                  }

                  setSearchResults(null);
                  
                  return [...users, user];
    
                });

              }}>
                <img src={`https://cdn.makuwro.com/${user.avatarPath}`} />
                {user.username}
              </li>
            );

          }

        } catch (err) {

          console.log(`Couldn't search for user: ${err.message}`);

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

UserInput.propTypes = {
  children: PropTypes.any,
  onChange: PropTypes.func,
  currentUser: PropTypes.object
};