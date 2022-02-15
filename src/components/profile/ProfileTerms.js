import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Profile.module.css";

export default function ProfileTerms() {

  return (
    <>
      <section className={styles["profile-card"]} id={styles["profile-terms"]}>
        <p>This user isn't sharing any terms with Makuwro. If you want to commission them, or want to use their characters, art, or literature, you should ask them about their policies before doing so.</p>
        <button style={{display: "block", marginTop: "1rem"}}>Edit terms</button>
      </section>
    </>
  );

}