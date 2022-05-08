import React, { useEffect, useState } from "react";
import styles from "../styles/Connecting.module.css";

export default function ConnectingScreen({ready, onClose, authenticated}) {

  const [closing, setClosing] = useState(false);
  const [message, setMessage] = useState();

  useEffect(() => {

    if (ready && !closing) {

      const messages = {
        member: [
          "Welcome back!",
          "swag",
          "How are you?",
          "Peep this one!",
          "There's this girl, and uh..."
        ],
        guest: [
          "Hi!",
          "Oh, hello here.",
          "Support small creators!"
        ]
      };
      const messageGroup = messages[authenticated ? "member" : "guest"];
      setMessage(messageGroup[Math.floor(Math.random() * messageGroup.length)]);

      setTimeout(() => {

        setClosing(true);

      }, 500);

    }

  }, [ready]);

  return (
    <section id={styles.connecting} className={closing ? styles.closing : null}>
      {
        ready ? (
          <section>
            {message}
          </section>
        ) : (
          <section>
            Connecting to Makuwro...
          </section>
        )
      }
    </section>
  );

}