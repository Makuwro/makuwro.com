import React from "react";
import styles from "../../styles/Profile.module.css";

export default function ProfileLibraryArt() {

  return (
    <section className={styles["profile-card"]} id={styles["profile-art"]}>
      <a className={styles["profile-library-item"]}>
        <img />
      </a>
    </section>
  );

}