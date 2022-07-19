import styles from "../styles/ArtViewer.module.css";
import React from "react";

export default function Collaborator({avatarPath, displayName, username, title}) {

  return (
    <a href={`/${username}`} className={styles.collaborator}>
      <img className={styles.avatar} src={`https://cdn.makuwro.com/${avatarPath}`} />
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