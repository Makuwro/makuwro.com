import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Profile.module.css";

export default function ProfileTerms() {

  return (
    <>
      <section className={styles["profile-card"]} id={styles["profile-terms"]}>
        This user didn't share any terms with Makuwro. If you want to commission them, or want to use their characters, art, or literature, you should <Link to="?message=">ask them about their policies</Link> before doing so.
      </section>
      <section className={styles["profile-card"]} style={{width: "auto", marginTop: "-3rem"}}>
        <button>Edit terms</button>
      </section>
    </>
  );

}