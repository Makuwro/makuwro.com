import React, { useEffect, useState } from "react";
import styles from "../../styles/Alert.module.css";


export default function Alert({closable, onInvisible, children, type = "success", link, index}) {

  const [visible, setVisible] = useState(false);

  useEffect(() => {

    setVisible(true);
    const timeout = setTimeout(() => {

      setVisible(false);

    }, 5000);

    return () => clearTimeout(timeout);

  }, []);

  const icons = {
    success: "thumb_up",
    error: "new_releases"
  };

  return (
    <section 
      className={`${styles.main} ${styles[type]}${visible ? ` ${styles.visible}` : ""}`} 
      onTransitionEnd={() => !visible && onInvisible(index)}
      style={{
        marginTop: index !== 0 ? `${(index * 40) + (index * 10)}px` : null
      }}
    >
      <section className={styles.icon}>
        <span className="material-icons-round">
          {icons[type]}
        </span>
      </section>
      <section className={styles.message}>
        {children}
      </section>
    </section>
  );

}