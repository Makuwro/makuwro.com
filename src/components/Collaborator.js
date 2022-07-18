import styles from "../styles/ArtViewer.module.css";
import React from "react";

export default function Collaborator({avatar, displayName, username, title}) {

  return (
    <a href={`/${username}`} className={styles.collaborator}>
      <img className={styles.avatar} src={avatar} />
      <section className={styles.collaboratorText}>
        <section>
          {displayName || `@${username}`}
        </section>
        {
          title && (
            <section className={styles.title}>
              {title}
            </section>
          )
        }
      </section>
    </a>
  );

}