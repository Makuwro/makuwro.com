import React, { useEffect, useState } from "react";
import styles from "../styles/Connecting.module.css";
import PropTypes from "prop-types";
import { Client } from "makuwro";
import { InvalidTokenError } from "makuwro-errors";

export default function ConnectivityCheck({ready, authenticated, setClient}) {

  const [closing, setClosing] = useState(false);
  const [message, setMessage] = useState("Connecting to the Internet...");
  const [seconds, setSeconds] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [offline, setOffline] = useState(false);

  useEffect(() => {

    if (ready && !closing) {

      const messages = {
        member: [
          "Welcome back!",
          "swag",
          "How are you?",
          "Peep this one!",
          "There's this girl, and uh...",
          "human??! are you serious? right in front of me???"
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

  useEffect(() => {

    async function verifyConnectionStatus() {

      try {
  
        // First, check if the client is offline.
        if (!navigator.onLine) {
  
          // We're having a problem, so we should let the user know.
          setMessage("Connecting to the Internet...");
          setOffline(true);
          throw new Error();
  
        }
  
        // Now, check if the server is available.
        setMessage("Connecting to Makuwro...");

        // Get the current user. 
        // If there isn't a token, this should error.
        const token = document.cookie.match("(^|;)\\s*token\\s*=\\s*([^;]+)")?.pop() || null;
        let client = new Client();
        client.token = token;
        await client.connect();

        // Tell the app that we're connected.
        setClient(client);
  
        // Reset the attempts and seconds just in case we get disconnected.
        setAttempt(0);
        setSeconds(0);
        
      } catch (err) {

        if (err instanceof InvalidTokenError) {

          // Delete the token cookie
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

          // Try again.
          await verifyConnectionStatus();

        } else {

          if (!seconds) {
  
            // Add five seconds times each attempt.
            setSeconds((attempt + 1) * 5);
            setAttempt(attempt + 1);
            
          }

        }
  
      }
  
    }

    if (ready) {

      if (!navigator.onLine) {

        setClosing(false);
        verifyConnectionStatus();

      }

    } else {

      if (seconds === 0) {

        verifyConnectionStatus();

      } else {

        setTimeout(() => {

          setSeconds(lastSeconds => lastSeconds - 1);

        }, 1000);

      }

    }
    
  }, [navigator.onLine, seconds, ready]);

  return (
    <section id={styles.connecting} className={closing ? styles.closing : null}>
      {
        <section>
          <h1>{message}</h1>
          {seconds ? (
            <p>{offline ? "We think you might be offline. Check your connection!" : "Sorry about the long wait! We're having server issues."} We'll try again in {seconds} second{seconds !== 1 ? "s" : ""}.</p>)
            : null
          }
        </section>
      }
    </section>
  );

}

ConnectivityCheck.propTypes = {
  ready: PropTypes.bool,
  authenticated: PropTypes.bool,
  setClient: PropTypes.func
};