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
            <li><a href="https://about.makuwro.com/policies/terms">Terms</a></li>
            <li><a href="https://about.makuwro.com/policies/privacy">Privacy</a></li>
          </ul>
        </section>
        <section>
          <h1>Contribute</h1>
          <ul>
            <li><Link to="/donate">Donate</Link></li>
            <li><a href="https://github.com/Makuwro/makuwro.com/issues">Feedback</a></li>
            <li><a href="https://github.com/Makuwro/makuwro.com">GitHub</a></li>
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
            <li><Link to="/forums">Forums</Link></li>
            <li><a href="https://support.makuwro.com">Support</a></li>
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
      <section id={styles["footer-copyright"]}>
        © 2022 Makuwro, LLC
      </section>
    </footer>
  );

}