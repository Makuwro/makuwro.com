import React from "react";
import styles from "../styles/Notification.module.css";

export default function Notification({icon = "info_outline", read, client, children, description, link, onClick}) {

  return (
    <section className={styles.notification}>
      <span className="material-icons-round">
        {icon}
      </span>
      <section className={styles.textContainer}>
        {children ? (
          <p>{children}</p>
        ) : null}
      </section>
    </section>
  );

};