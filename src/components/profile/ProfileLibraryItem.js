import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Profile.module.css";
import PropTypes from "prop-types";

const cache = {};

export default function ProfileLibraryItem({tab, profileInfo, currentUser, updated, isCharacter}) {

  const plural = /s$/g;
  const [items, setItems] = useState(null);
  const [ready, setReady] = useState(false);
  const ownProfile = profileInfo.username === currentUser.username;

  useEffect(async () => {

    let mounted = true;

    if (updated) {

      cache[profileInfo.username] = {};
      
    } else if (profileInfo.username) {

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
        const response = await fetch(`${process.env.RAZZLE_API_DEV}contents/${isCharacter ? `characters/${profileInfo.owner.username}/${profileInfo.slug}/${tab}` : `${tab}/${profileInfo.username}`}`, {headers});

        // Check if everything's OK.
        if (mounted) {

          if (response.ok) {

            // Iterate through the items and turn them into links.
            const content = await response.json();
            for (let i = 0; content.length > i; i++) {

              content[i] = <Link className={styles["profile-library-item"]} key={i} to={`/${profileInfo.username}/${tab}/${content[i].slug}`}>
                <img src={`https://cdn.makuwro.com/${content[i].imagePath || content[i].avatarPath}`} />
              </Link>;

            }

            // Push the items to render.
            if (mounted) setItems(content);

            // Cache the content so we don't spam the API.
            cache[profileInfo.username][tab] = content;

          } else {

            setItems([]);

          }

        }

      }
      
      setReady(true);

    }

    return () => {

      mounted = false;

    };

  }, [tab, profileInfo, updated]);

  return ready && (
    <section className={`${styles["profile-library"]} ${styles["profile-card"]}`} id={styles["profile-" + tab]}>
      {ownProfile && (
        <Link className={styles["profile-library-item"]} style={{backgroundColor: "black"}} to={`?action=create-${plural.test(tab) ? tab.substring(0, tab.length - 1) : tab}`}>
          CREATE NEW
        </Link>
      )}
      {items || (!ownProfile && <p>{profileInfo.owner.username} doesn't have much to share right now, but who knows: they're probably working on the next big thing.</p>)}
    </section>
  );

}

ProfileLibraryItem.propTypes = {
  tab: PropTypes.string,
  currentUser: PropTypes.object,
  profileInfo: PropTypes.object
};