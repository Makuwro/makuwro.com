import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Profile.module.css";

export default function ProfileLibraryItem({tab, info}) {

  return (
    <section className={`${styles["profile-library"]} ${styles["profile-card"]}`} id={styles["profile-" + tab]}>
      <Link className={styles["profile-library-item"]} to={`?create=${tab}`}>
        CREATE NEW
      </Link>
    </section>
  );

}