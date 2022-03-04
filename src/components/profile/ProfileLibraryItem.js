import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Profile.module.css";
import PropTypes from "prop-types";

const cache = {};

export default function ProfileLibraryItem({tab, profileInfo, currentUser, updated, isCharacter}) {

  const plural = /s$/g;
  const [items, setItems] = useState(null);
  const [ready, setReady] = useState(false);
  const ownProfile = currentUser.id && ((profileInfo.id === currentUser.id) || (profileInfo.owner?.id === currentUser.id));

  useEffect(() => {

    setReady(false);

  }, [tab]);

  useEffect(async () => {

    let mounted = true;

    if (updated) {

      cache[profileInfo.username] = {};
      
    } else if (isCharacter || profileInfo.username) {

      // Get the stuff from the server.
      const headers = currentUser.token ? {
        token: currentUser.token
      } : {};
      const response = !isCharacter && await fetch(`${process.env.RAZZLE_API_DEV}contents/${tab}/${profileInfo.username}`, {headers});

      // Check if everything's OK.
      if (mounted) {

        if (isCharacter || response.ok) {

          let content = isCharacter ? [...profileInfo[tab] || []] : await response.json();

          for (let i = 0; content.length > i; i++) {

            content[i] = <Link className={styles["profile-library-item"]} key={i} to={`/${content[i].owner.username}/${tab}/${content[i].slug}`}>
              <img src={`https://cdn.makuwro.com/${content[i].imagePath || content[i].avatarPath}`} alt={content[i].name || content[i].description} title={content[i].name || content[i].description} />
            </Link>;

          }

          // Push the items to render.
          if (mounted) setItems(content[0] ? content : null);

        } else {

          setItems(null);

        }

      }
      
    }

    setReady(true);

    return () => {
      
      mounted = false;

    };

  }, [tab, currentUser, updated]);

  return ready && (
    <section className={`${styles["profile-library"]} ${styles["profile-card"]}`} id={styles["profile-" + tab]} onTransitionEnd={(event) => event.stopPropagation()}>
      {ownProfile && !isCharacter && (
        <Link className={styles["profile-library-item"]} style={{backgroundColor: "black"}} to={`?action=create-${plural.test(tab) ? tab.substring(0, tab.length - 1) : tab}`}>
          CREATE NEW
        </Link>
      )}
      {items || (ownProfile ? (
        isCharacter && (<p>You can attach this character to {tab} by tagging this character.</p>)
      ) : (
        <p>{profileInfo.username || profileInfo.owner.username} doesn't have much to share right now, but who knows: they're probably working on the next big thing.</p>
      ))}
    </section>
  );

}

ProfileLibraryItem.propTypes = {
  tab: PropTypes.string,
  currentUser: PropTypes.object,
  profileInfo: PropTypes.object
};