import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "../styles/Home.module.css";
import { useLocation } from "react-router-dom";

export default function Home({setLocation}) {

  const location = useLocation();
  const [leaving, setLeaving] = useState(true);

  useEffect(() => {

    if (location.pathname !== "/signin" && location.pathname !== "/register" && location.pathname !== "/" && location.pathname !== "/notifications") {

      setLeaving(true);

    } else if (location.pathname === "/") {

      document.title = "Makuwro, the cool worldbuilding platform";
      setLeaving(false);

    }

  }, [location]);

  return (
    <main id={styles.home} className={leaving ? "leaving" : null} onTransitionEnd={() => {

      if (leaving) {

        setLocation(location);

      }

    }}>
      <section>
        <h1>Welcome to Makuwro</h1>
        <h2>The easiest way to store characters, worlds, and lore</h2>
      </section>
      <section id={styles["home-features"]}>
        <section>
          <h1>A place for all your worlds</h1>
          <p>On Makuwro, you can make dedicated pages for your characters and lore. You can share it with a team, friends, or keep it to yourself. You can even group it into a wiki-like world.</p>
        </section>
        <section>
          <h1>Collaborate with others with a live editor</h1>
          <p></p>
        </section>
        <section>
          <h1>Make it how you want it</h1>
          <p>Customization is fundamental in Makuwro. Know CSS? Great! Here's a paint bucket, a couple of pens, <a href="https://help.makuwro.com/articles/dev/css-reference">a giant book</a>, and an infinite supply of blinds.</p> <p>Don't know CSS? That's fine too. We have some themes for you to pick from. Besides the universe <strike>(editor's note: I'm not sure if you're a deity or sumn)</strike>, the power to change anything is your hands.</p>
        </section>
        <section>
          <h1>What do you think of roleplay?</h1>
          <p>Of course you can act as yourself on the site, but why not try jumping in Steve's shoes or Clover's boots? <a href="https://www.youtube.com/watch?v=kRWuYHNjc84" target="_blank" rel="noreferrer">Maybe you aren't Satan, but you're Staan!</a></p>
        </section>
        <section>
          <h1>An ongoing project</h1>
          <p>Makuwro isn't finished, and we're not going anywhere. We need your feedback to make this the best worldbuilding database for creators.</p>
        </section>
        <section>
          <p>Why not give it a try?</p>
          <button>Join today</button>
        </section>
      </section>
    </main>
  );

}

Home.propTypes = {
  shownLocation: PropTypes.object,
  setLocation: PropTypes.func
};