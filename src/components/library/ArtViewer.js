import styles from "../../styles/ArtViewer.module.css";
import React from "react";
import Collaborator from "../Collaborator";

const artRegex = /^\/(?<username>[^/]+)\/art\/(?<slug>[^/]+)\/?$/gm;

export default function ArtViewer() {

  return (
    <section id={styles.viewer}>
      <section id={styles.imageContainer}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Smokestacks_of_Chemical_Plant_11-1972_%283703566787%29.jpg" />
      </section>
      <section id={styles.details}>
        <section id={styles.collaborators}>
          <Collaborator 
            avatar="https://pbs.twimg.com/profile_images/1503878170642104320/hWzBPHQl_400x400.jpg"
            displayName="Christian Toney"
            username="Christian"
            title="Publisher" />
          <Collaborator 
            avatar="https://pbs.twimg.com/profile_images/1503878170642104320/hWzBPHQl_400x400.jpg"
            displayName="Christian Toney"
            username="Christian"
            title="Developer" />
          <button>View all collaborators</button>
        </section>
        <section id={styles.description}>
          Aren't they a cutie? 🥰
          <section id={styles.metadata}>
            <section id={styles.tags}>
              <span>pollution</span>
              <span>your mom</span>
            </section>
            <section id={styles.date}>
              Uploaded on May 14, 2022
            </section>
          </section>
        </section>
      </section>
    </section>
  );

}

ArtViewer.propTypes = {

}