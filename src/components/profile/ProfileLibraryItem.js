import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Profile.module.css";
import PropTypes from "prop-types";

const cache = {};

export default function ProfileLibraryItem({tab, owner, client, updated, isCharacter}) {

  const plural = /s$/g;
  const [items, setItems] = useState(null);
  const [ready, setReady] = useState(false);
  const {user} = client;
  const ownProfile = owner.id === user?.id;

  useEffect(() => {

    setReady(false);

  }, [tab]);

  useEffect(() => {

    let mounted = true;

    if (updated) {

      cache[owner.username] = {};
      setReady(true);
      
    } else if (isCharacter || owner.username) {
      
      (async () => {

        // Get the stuff from the server.
        const content = isCharacter ? [...owner[tab]] : await client[`getAll${tab.slice(0, 1).toUpperCase()}${tab.slice(1)}`](owner);

        // Check if everything's OK.
        if (content) {

          for (let i = 0; content.length > i; i++) {

            content[i] = (
              <Link 
                draggable={false} 
                className={styles["profile-library-item"]} 
                key={i} 
                to={`/${content[i].owner.username}/${tab}/${content[i].slug}`}>
                {content[i].imagePath || content[i].avatarPath ? (
                  <img 
                    src={`https://cdn.makuwro.com/${content[i].imagePath || content[i].avatarPath}`} 
                    alt={content[i].name || content[i].description} 
                    title={content[i].name || content[i].description} 
                  />
                ) : content[i].name}
              </Link>
            );

          }

          if (ownProfile && !isCharacter) {

            content.unshift(
              <Link 
                key={"new"} 
                draggable={false} 
                className={styles["profile-library-item"]} 
                style={{backgroundColor: "black"}} 
                to={`?action=${tab === "art" ? "upload" : "create"}-${plural.test(tab) ? tab.substring(0, tab.length - 1) : tab}`}>
                CREATE NEW
              </Link>
            );

          }

          // Push the items to render.
          if (mounted) setItems(content[0] ? content : null);

        } else {

          setItems(null);

        }

        setReady(true);

      })();
      
    }

    return () => {
      
      mounted = false;

    };

  }, [tab, user, updated]);

  return ready && (
    <section className={`${styles["profile-library"]} ${styles["profile-card"]}`} id={styles["profile-" + tab]} onTransitionEnd={(event) => event.stopPropagation()}>
      {items || (ownProfile ? (
        isCharacter && (<p>You can attach this character to {tab} by tagging this character.</p>)
      ) : (
        <p>{owner.username || owner.owner.username} doesn't have much to share right now, but who knows: they're probably working on the next big thing.</p>
      ))}
    </section>
  );

}

ProfileLibraryItem.propTypes = {
  tab: PropTypes.string.isRequired,
  client: PropTypes.object.isRequired,
  owner: PropTypes.object.isRequired
};