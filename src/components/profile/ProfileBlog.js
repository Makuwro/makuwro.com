import React from "react";
import styles from "../../styles/Profile.module.css";

export default function ProfileBlog() {

  return (
    <section className={styles["profile-card"]} id={styles["profile-blog"]}>
      <section className={styles["profile-blog-post"]}>
        <section>
          <img />
          <section>Display name</section>
          <section>@Username</section>
        </section>
        <section>
          <p>Content...</p>
        </section>
      </section>
    </section>
  );

}