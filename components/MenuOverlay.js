import React from "react";
import styles from "../styles/MenuOverlay.module.css";
import PropTypes from "prop-types";
import Link from "next/link";

function MenuOverlay(props) {

  return (
    <div id={styles["menu-overlay"]} className={props.visible ? styles.block : null}>
      <nav>
        <div>
          <Link href="/">Home</Link>
          <a href="/blog">Blog</a>
          <Link href="/articles">Articles</Link>
        </div>
        <div>
          <Link href="/categories/Characters">Characters</Link>
          <Link href="/categories/Seasons">Seasons</Link>
          <Link href="/categories/Worlds">Worlds</Link>
          <Link href="/categories/Objects">Objects</Link>
          <Link href="/categories/Music">Music</Link>
        </div>
        <div>
          <a href="https://discord.gg/gMeWeEUQeE" target="_blank" rel="noreferrer">Collaborator Discord</a>
          <a href="/" target="_blank" rel="noreferrer">Report an issue</a>
          <a href="https://beastslash.com/policy/collaborators" target="_blank" rel="noreferrer">Beastslash collaborator policy</a>
        </div>
      </nav>
      <div id={styles["menu-overlay-bg"]}></div>
    </div>
  );

}

MenuOverlay.propTypes = {
  visible: PropTypes.boolean
};

export default MenuOverlay;