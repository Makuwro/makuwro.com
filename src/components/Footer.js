import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Footer.module.css";

export default function Footer() {

  return (
    <footer>
      <section id={styles["footer-columns"]}>
        <section>
          <h1>About</h1>
          <ul>
            <li><a href="https://about.makuwro.com">Company</a></li>
            <li><a href="https://about.makuwro.com/team">Team</a></li>
          </ul>
        </section>
        <section>
          <h1>Contribute</h1>
          <ul>
            <li><a href="https://ko-fi.com/Makuwro">Donate</a></li>
            <li><a href="https://github.com/Makuwro/makuwro.com/issues">Feedback</a></li>
            <li><a href="https://github.com/Makuwro/makuwro.com">Code</a></li>
          </ul>
        </section>
        <section>
          <h1>Library</h1>
          <ul>
            <li><Link to="/library/art">Art</Link></li>
            <li><Link to="/library/characters">Characters</Link></li>
            <li><Link to="/library/literature">Literature</Link></li>
            <li><Link to="/library/worlds">Worlds</Link></li>
            <li><Link to="/library">Show me everything!</Link></li>
          </ul>
        </section>
        <section>
          <h1>Resources</h1>
          <ul>
            <li><a href="https://help.makuwro.com">Help center</a></li>
            <li><a href="https://help.makuwro.com/policies/terms">Terms of service</a></li>
            <li><a href="https://help.makuwro.com/policies/community-guidelines">Community guidelines</a></li>
            <li><a href="https://help.makuwro.com/policies/privacy">Privacy</a></li>
            <li><a href="https://help.makuwro.com/contact">Contact us</a></li>
          </ul>
        </section>
        <section>
          <h1>Social</h1>
          <ul>
            <li><a href="https://twitter.com/Makuwro">@Makuwro</a></li>
            <li><a href="https://twitter.com/DaDragonDen">@DaDragonDen</a></li>
            <li><a href="https://den.makuwro.com/join">Discord server</a></li>
          </ul>
        </section>
      </section>
      <p id={styles["footer-copyright"]}>
        © 2022 Makuwro, LLC
      </p>
    </footer>
  );

}