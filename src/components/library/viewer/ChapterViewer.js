import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/ChapterViewer.module.css";
import Footer from "../../Footer";

export default function ChapterViewer({editing = true}) {

  const [ws, setWS] = useState();

  useEffect(() => {

    

  }, [editing]);

  return (
    <main>
      <section id={styles.chapterBannerContainer}>
        <img src="" alt="Banner" />
      </section>
      <section id={styles.details}>
        <h1 contentEditable={editing}>Chapter name</h1>
        <section id={styles.author}>
          <section id={styles.authorImageContainer}>
            <img src="https://pbs.twimg.com/profile_images/1477875323953991682/MM_ZZPTh_400x400.jpg" alt="Author" />
          </section>
          <Link to={"/"}>Author</Link>
        </section>
      </section>
      <section id={styles.content} contentEditable={editing}>
        <p>This is a paragraph! I think it's pretty cool. Do you?</p>
        <p>Yeah, it's very cool.</p>
      </section>
      <section id={styles.commentsContainer}>
        <h1>Comments</h1>
        <textarea></textarea>
      </section>
      <Footer />
    </main>
  );

}