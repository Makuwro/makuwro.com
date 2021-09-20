import React from "react";
import "../styles/menu.css";
import PropTypes from "prop-types";

function MenuOverlay(props) {
  
  return (
    <div id="menu-overlay" className={props.visible ? "block" : null}>
      <nav>
        <div>
          <a href="/">Home</a>
          <a href="/">Blog</a>
          <a href="/">Articles</a>
        </div>
        <div>
          <a href="/">Characters</a>
          <a href="/">Seasons</a>
          <a href="/">Worlds</a>
          <a href="/">Objects</a>
          <a href="/">Music</a>
        </div>
        <div>
          <a href="/">Collaborator Discord</a>
          <a href="/">Report an issue</a>
          <a href="/">Beastslash collaborator policy</a>
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