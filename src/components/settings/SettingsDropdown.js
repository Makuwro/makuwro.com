import React from "react";
import styles from "../../styles/Settings.module.css";

export default function SettingsDropdown({title, description, children, open, onClick}) {

  return (
    <section className={open ? styles.open : ""} onClick={onClick ? onClick : null}>
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