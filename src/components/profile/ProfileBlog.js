import React, { useState } from "react";
import styles from "../../styles/Profile.module.css";
import BlogPost from "../BlogPost";
import PropTypes from "prop-types";

export default function ProfileBlog({currentUser, profileInfo, notify}) {

  const [posts, setPosts] = useState(null);


  const ownProfile = currentUser.username === profileInfo.username;

  async function submit(event) {

    // Please don't reload the page.
    event.preventDefault();

    try {



    } catch (err) {



    }

  }

  return (
    <section className={styles["profile-card"]} id={styles["profile-blog"]}>
      {ownProfile && (
        <form className={styles["profile-blog-post"]} onSubmit={submit}>
          <img src={`https://cdn.makuwro.com/${currentUser.avatarPath}`} />
          <section>
            <section className={styles.names}>
              {profileInfo.displayName && (
                <section>{profileInfo.displayName}</section>
              )}
              <section className={styles.username}>@{profileInfo.username}</section>
            </section>
            <textarea required placeholder="What's new with you?" />
            <input type="submit" value="Post" />
          </section>
        </form>
      )}
      {posts || !ownProfile ? (<p>Huh, looks like they don't have much to say right now. Check back later!</p>) : null}
    </section>
  );

}

ProfileBlog.propTypes = {
  profileInfo: PropTypes.object,
  currentUser: PropTypes.object
};