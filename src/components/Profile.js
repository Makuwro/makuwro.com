import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "../styles/Profile.module.css";
import Footer from "./Footer";
import ProfileLibraryItem from "./profile/ProfileLibraryItem";
import ProfileStats from "./profile/ProfileStats";

export default function Profile() {

  const {username, tab = "comments"} = useParams();
  const state = {
    displayName: useState(username),
    disabled: useState(false)
  };
  const components = {
    art: <ProfileLibraryItem tab="art" />,
    literature: <ProfileLibraryItem tab="literature" />,
    worlds: <ProfileLibraryItem tab="worlds" />,
    teams: <ProfileLibraryItem tab="teams" />,
    stats: <ProfileStats />
  };
  let tabComponent;

  document.title = `${state.displayName[0]} / Makuwro`;
  tabComponent = components[tab];

  return (
    <main id={styles["profile"]}>
      <section id={styles["profile-bg"]}>
        <button id={styles["profile-btn-edit"]}>Edit profile</button>
        <section id={styles["profile-info"]}>
          <img src="https://pbs.twimg.com/profile_images/1477875323953991682/MM_ZZPTh_400x400.jpg" />
          <section>
            <h1>{state.displayName[0]}<span title="This user is a Makuwro staff member" className={styles["profile-badge"]}>STAFF</span></h1>
            <h2>{`@${username}`}</h2>
            {state.disabled[0] && (
              <p>This account has been disabled for violating the <a href="https://about.makuwro.com/policies/terms">terms of service</a></p>
            )}
          </section>
        </section>
      </section>
      <section id={styles["profile-container"]}>
        <section id={styles["profile-container-left"]}>
          <section className={styles["profile-card"]} id={styles["profile-bio"]}>
            <h1>About</h1>
            <p>I'm extra epic</p>
          </section>
        </section>
        <section id={styles["profile-container-center"]}>
          <section className={styles["profile-card"]} id={styles["profile-selection"]}>
            <Link to={`/${username}/art`}>Art</Link>
            <Link to={`/${username}/blog`}>Blog</Link>
            <Link to={`/${username}/characters`}>Characters</Link>
            <Link to={`/${username}/comments`}>Comments</Link>
            <Link to={`/${username}/literature`}>Literature</Link>
            <Link to={`/${username}/stats`}>Stats</Link>
            <Link to={`/${username}/teams`}>Teams</Link>
            <Link to={`/${username}/terms`}>Terms</Link>
            <Link to={`/${username}/worlds`}>Worlds</Link>
          </section>
          <>{tabComponent}</>
        </section>
        <section id={styles["profile-container-right"]}>
          <section className={styles["profile-card"]} id={styles["profile-actions"]}>
            <button>Follow</button>
            <button>Message</button>
            <button className="destructive">Block</button>
            <button className="destructive">Report</button>
          </section>
        </section>
      </section>

      <Footer />
    </main>
  );

}