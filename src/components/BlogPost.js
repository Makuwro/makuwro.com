import React from "react";
import styles from "../styles/Profile.module.css";

export default function BlogPost({avatarURL, displayName, username, children, badge, commentsDisabled}) {

  return (
    <article className={styles["profile-blog-post"]}>
      <img src={avatarURL} />
      <section>
        <section className={styles.names}>
          <section>{displayName}</section>
          {username && (<section className={styles.username}>@{username}</section>)}
          {badge && (<section className={styles.badge}>{badge}</section>)}
          <section className={styles.username}>•</section>
          <section className={styles.username}>2 hours ago</section>
        </section>
        <section className={styles.content}>
          {children}
        </section>
      </section>
    </article>
  );

}