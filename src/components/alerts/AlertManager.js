import React, { useState, useEffect } from "react";
import Alert from "./Alert";
import styles from "../../styles/Alert.module.css";

export default function AlertManager({alerts, onChange}) {

  const [comps, setComps] = useState();
  
  useEffect(() => {

    if (alerts[0]) {

      setComps(() => {

        const comps = [];

        for (let i = 0; alerts.length > i; i++) {

          const config = alerts[i];
          
          comps.push(
            <Alert 
              key={i} 
              index={i} 
              type={config.type}
              onInvisible={onChange}
            >
              {config.children}
            </Alert>
          );

        }

        return comps;

      });

    }

  }, [alerts]);

  useEffect(() => {

    console.log(comps);

  }, [comps]);

  return comps ? (
    <section id={styles.manager}>
      {comps}
    </section>
  ) : null;

}