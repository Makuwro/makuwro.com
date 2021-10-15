import React from "react";
import "../styles/MenuOverlay.module.css";
import PropTypes from "prop-types";
import Link from "next/link";

function MenuOverlay(props) {
  
  return (
    <div id="menu-overlay" className={props.visible ? "block" : null}>
      <nav>
        <div>
          <Link to="/">Home</Link>
          <a href="/blog">Blog</a>
          <Link to="/articles">Articles</Link>
        </div>
        <div>
          <Link to="/categories/Characters">Characters</Link>
          <Link to="/categories/Seasons">Seasons</Link>
          <Link to="/categories/Worlds">Worlds</Link>
          <Link to="/categories/Objects">Objects</Link>
          <Link to="/categories/Music">Music</Link>
        </div>
        <div>
          <a href="https://discord.gg/gMeWeEUQeE" target="_blank" rel="noreferrer">Collaborator Discord</a>
          <a href="/" target="_blank" rel="noreferrer">Report an issue</a>
          <a href="https://beastslash.com/policy/collaborators" target="_blank" rel="noreferrer">Beastslash collaborator policy</a>
        </div>
      </nav>
      <div id="menu-overlay-bg"></div>
    </div>
  );

}

MenuOverlay.propTypes = {
  visible: PropTypes.boolean
};

export default MenuOverlay;