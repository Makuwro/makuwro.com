import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/Settings.module.css";

export default function SettingsDropdown({title, description, children, open, onClick}) {

  const location = useLocation();
  const hash = title.toLowerCase().replaceAll(" ", "-");
  const [highlighted, setHighlighted] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {

    if (location.hash.slice(1) === hash) {

      setHighlighted(true);

    } else {

      setHighlighted(false);

    }

  }, [location.hash]);

  useEffect(() => {

    if (highlighted && !open) {

      navigate(location.pathname, {replace: true});

    }

  }, [open]);

  return (
    <section className={`${styles.option}${open ? ` ${styles.open}` : ""}${highlighted ? ` ${styles.highlighted}` : ""}` || null} onClick={onClick ? onClick : null} id={hash}>
      <section className={styles.header}>
        <section>
          <b>{title}</b>
          {description && <p>{description}</p>}
        </section>
        <span>▼</span>
      </section>
      <section className={styles.content} onClick={(event) => event.stopPropagation()}>
        {children}
      </section>
    </section>
  );

}