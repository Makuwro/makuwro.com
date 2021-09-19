import React from "react";
import "../styles/menu.css";

class MenuOverlay extends React.Component {
  
  constructor(props) {

    super(props);

  }
  
  render() {

    return (
      <div id="menu-overlay">
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

}

export default MenuOverlay;