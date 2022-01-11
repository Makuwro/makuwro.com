import React from "react";
import styles from "../../styles/Profile.module.css";

export default function ProfileStats() {

  return (
    <section className={styles["profile-card"]} id={styles["profile-stats"]}>
      <section>
        <section>
          Joined on
        </section>
        <section>
          January 11, 2022
        </section>
      </section>
      <section>
        <section>
          Last seen
        </section>
        <section>
          Just now
        </section>
      </section>
      <section>
        <section>
          Following
        </section>
        <section>
          0
        </section>
      </section>
      <section>
        <section>
          Followers
        </section>
        <section>
          0
        </section>
      </section>
      <section>
        <section>
          ID
        </section>
        <section>
          0
        </section>
      </section>
    </section>
  );

}