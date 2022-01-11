import React from "react";
import styles from "../../styles/Profile.module.css";

export default function ProfileLibraryItem({tab}) {

  return (
    <section className={`${styles["profile-library"]} ${styles["profile-card"]}`} id={styles["profile-" + tab]}>
      <a className={styles["profile-library-item"]}>
        <img />
      </a>
    </section>
  );

}