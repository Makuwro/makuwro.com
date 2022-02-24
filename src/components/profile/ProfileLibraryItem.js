import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Profile.module.css";
import PropTypes from "prop-types";

const cache = {};

export default function ProfileLibraryItem({tab, profileInfo, currentUser, updated}) {

  const plural = /s$/g;
  const [items, setItems] = useState(null);
  const [ready, setReady] = useState(false);
  const ownProfile = profileInfo.username === currentUser.username;

  useEffect(async () => {

    if (updated) {

      cache[profileInfo.username] = {};
      
    } else if (profileInfo.username) {

      setReady(false);

      if (!cache[profileInfo.username]) {

        cache[profileInfo.username] = {};

      }

      if (cache[profileInfo.username][tab]) {

        setItems(cache[profileInfo.username][tab]);

      } else {

        // Get the stuff from the server.
        const headers = currentUser.token ? {
          token: currentUser.token
        } : {};
        const response = await fetch(`${process.env.RAZZLE_API_DEV}contents/${tab}/${profileInfo.username}`, {headers});

        // Check if everything's OK.
        if (response.ok) {

          // Iterate through the items and turn them into links.
          const content = await response.json();
          let i;
          for (i = 0; content.length > i; i++) {

            content[i] = <Link className={styles["profile-library-item"]} key={i} to={`/${profileInfo.username}/${tab}/${content[i].slug}`}>
              <img src={`https://cdn.makuwro.com/${content[i].imagePath}`} />
            </Link>;

          }

          // Push the items to render.
          setItems(content);

          // Cache the content so we don't spam the API.
          cache[profileInfo.username][tab] = content;

        } else {

          setItems([]);

        }

      }
      
      setReady(true);

    }

  }, [tab, profileInfo.username, updated]);

  return ready && (
    <section className={`${styles["profile-library"]} ${styles["profile-card"]}`} id={styles["profile-" + tab]}>
      {ownProfile && (
        <Link className={styles["profile-library-item"]} style={{backgroundColor: "black"}} to={`?action=create-${plural.test(tab) ? tab.substring(0, tab.length - 1) : tab}`}>
          CREATE NEW
        </Link>
      )}
      {items || (!ownProfile && <p>{profileInfo.username} doesn't have much to share right now, but who knows: they're probably working on the next big thing.</p>)}
    </section>
  );

}

ProfileLibraryItem.propTypes = {
  tab: PropTypes.string,
  currentUser: PropTypes.object,
  profileInfo: PropTypes.object
};