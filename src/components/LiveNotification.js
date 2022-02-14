import React, { useEffect, useState } from "react";
import styles from "../styles/LiveNotification.module.css";

export default function LiveNotification({title, children, timeout = 5000, onClose}) {

  const [shown, setShown] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {

    if (timeout) {

      setTimeout(() => setDismissed(true), timeout);

    }

    setShown(true);

    return () => {

      setShown(false);

    };

  }, [timeout]);

  return (
    <section className={`${styles.notification} ${shown ? styles.shown : ""} ${dismissed ? styles.dismissed : ""}`} onTransitionEnd={() => {
    
      if (dismissed) {

        onClose();

      }

    }}>
      <h1>{title}</h1>
      <p>{children}</p>
    </section>
  );

}