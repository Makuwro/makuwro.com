import React from "react";
import "../styles/header.css";

function Header() {

  return (
    <header>
      <section>
        <button id="menu-button">
          <img src="/icons8-menu.svg" />
        </button>
        <div id="wiki-name">The Showrunners</div>
      </section>
      <form id="search-box">
        <input type="text" placeholder="Search for a page..." />
      </form>
      <section>
        <img id="search-icon" src="/Search-icon.svg" />
        <button id="account-button" style={{
          backgroundImage: "url(https://cdn.discordapp.com/avatars/419881371004174338/7ad97db287910c6fe8f627f3e0102197.png?size=1024)",
          backgroundSize: "cover"
        }}></button>
      </section>
    </header>
  );

}

export default Header;