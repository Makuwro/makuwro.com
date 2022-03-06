import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Footer.module.css";

export default function Footer() {

  const [columns, setColumns] = useState(null);
  const [open, setOpen] = useState();

  // Set up the columns. 
  useEffect(() => {

    const sections = {
      "About": [
        ["Company", "https://about.makuwro.com"],
        ["Team", "https://about.makuwro.com/team"]
      ],
      "Contribute": [
        ["Donate", "https://ko-fi.com/Makuwro"],
        ["Feedback", "https://github.com/Makuwro/makuwro.com/issues"],
        ["Code", "https://github.com/Makuwro/makuwro.com"]
      ],
      "Library": [
        ["Art", "/library/art"],
        ["Characters", "/library/characters"],
        ["Literature", "/library/literature"],
        ["Worlds", "/library/worlds"],
        ["Show me everything!", "/library"]
      ],
      "Resources": [
        ["Help center", "https://help.makuwro.com"],
        ["Terms of service", "https://help.makuwro.com/policies/terms"],
        ["Community rules", "https://help.makuwro.com/policies/community-rules"],
        ["Privacy", "https://help.makuwro.com/policies/privacy"],
        ["Contact us", "https://help.makuwro.com/contact"]
      ],
      "Social": [
        ["@Makuwro", "https://twitter.com/Makuwro"],
        ["@DaDragonDen", "https://twitter.com/DaDragonDen"],
        ["Discord server", "https://den.makuwro.com/join"]
      ]
    };
    const columnKeys = Object.keys(sections);
    const columnComps = [];

    for (let i = 0; columnKeys.length > i; i++) {

      const key = columnKeys[i];
      const items = [];
      for (let x = 0; sections[key].length > x; x++) {

        const item = sections[key][x];
        items[x] = (
          <li key={item[1]}>
            <a href={item[1]}>{item[0]}</a>
          </li>
        );
        
      }
      columnComps[i] = (
        <section key={key} className={open === key ? styles.open : null}>
          <h1 onClick={() => setOpen(open === key ? null : key)}>
            {key}
            <span>▼</span>
          </h1>
          <ul>
            {items}
          </ul>
        </section>
      );

    }

    setColumns(columnComps);

  }, [open]);

  return columns ? (
    <footer>
      <section id={styles.content}>
        <section id={styles.columns}>
          {columns}
        </section>
        <p id={styles.copyright}>
          © 2022 Makuwro, LLC
        </p>
      </section>
    </footer>
  ) : null;

}