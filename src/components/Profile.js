import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "../styles/Profile.module.css";
import Footer from "./Footer";
import ProfileLibraryItem from "./profile/ProfileLibraryItem";
import ProfileStats from "./profile/ProfileStats";
import ProfileTerms from "./profile/ProfileTerms";
import ProfileBlog from "./profile/ProfileBlog";

export default function Profile() {

  const {username, tab, id} = useParams();
  const state = {
    displayName: useState(username),
    disabled: useState(false),
    shifting: useState(false)
  };
  const [editorOpen, setEditorOpen] = useState(false);
  let navigate;
  let components;
  let tabComponent;
  let i;
  let navChildren;
  let navItems;
  let isLiterature;

  // Add links to the profile navigator
  navigate = useNavigate();
  navChildren = [];
  isLiterature = tab === "literature" && id;
  navItems = isLiterature ? [
    "Chapters",
    "Characters"
  ] : [
    "Art", 
    "Blog", 
    "Characters", 
    "Literature", 
    "Stats", 
    "Teams", 
    "Terms", 
    "Worlds"
  ];
  for (i = 0; navItems.length > i; i++) {

    // First, let's work on the onClick function
    let item = navItems[i];
    let itemLC = item.toLowerCase();
    let element;
    let onClick = (event) => {

      // Don't go to the link quite yet, let's animate this first
      event.preventDefault();

      // Change the state
      state.shifting[1](true);
      
      // Wait for the animation to finish
      setTimeout(() => {

        // Now it's time to go to the next page
        navigate(`/${username}/${itemLC}`);

        // Change the state again
        state.shifting[1](false);

      }, 150);

    };

    // Create the link
    element = React.createElement(Link, {
      to: `/${username}/${isLiterature ? `literature/${id}/` : ""}${itemLC}`,
      className: itemLC === tab ? "selected" : null,
      onClick: itemLC !== tab ? onClick : null,
      key: itemLC
    }, item);

    // Push it for use later
    navChildren.push(element);

  }

  // Set the current view
  components = {
    art: <ProfileLibraryItem tab="art" />,
    literature: <ProfileLibraryItem tab="literature" />,
    worlds: <ProfileLibraryItem tab="worlds" />,
    teams: <ProfileLibraryItem tab="teams" />,
    stats: <ProfileStats />,
    characters: <ProfileLibraryItem tab="characters" />,
    terms: <ProfileTerms />,
    blog: <ProfileBlog />
  };
  tabComponent = components[tab];

  return (
    <section id={styles.profileEditor} className={editorOpen ? styles.open : null}>
      <main id={styles.profile} className={isLiterature ? styles.literature : null}>
        <section id={styles["profile-header"]}>
          <section id={styles.profileBannerContainer}>
            {/*<img src="https://i1.sndcdn.com/visuals-000205406223-miu7o4-t2480x520.jpg" />*/}
          </section>
          <button id={styles["profile-btn-edit"]} onClick={() => setEditorOpen(true)}>Edit profile</button>
          <section id={styles["profile-info"]}>
            {!isLiterature && (
              <img src="https://pbs.twimg.com/profile_images/1477875323953991682/MM_ZZPTh_400x400.jpg" />
            )}
            <section>
              <h1>
                {state.displayName[0]}
                {!isLiterature && (
                  <span title="This user is a Makuwro staff member" className={styles["profile-badge"]}>MAKER</span>
                )}
              </h1>
              <h2>
                {isLiterature ? state.displayName[0] : `@${username}`}
              </h2>
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
            <nav className={styles["profile-card"]} id={styles["profile-selection"]}>
              {navChildren}
            </nav>
            <section className={state.shifting[0] ? styles.invisible : null}>
              {tabComponent}
            </section>
          </section>
          <section id={styles["profile-container-right"]}>
            <section className={styles["profile-card"]} id={styles["profile-actions"]}>
              {isLiterature ? (
                <button>Subscribe</button>
              ) : (
                <>
                  <button>Follow</button>
                  <button>Message</button>
                  <button className="destructive">Block</button>
                </>
              )}
              <button className="destructive" onClick={() => navigate("?action=report-abuse")}>Report</button>
            </section>
          </section>
        </section>

        <Footer />
      </main>
      <section id={styles.profileEditorOptions}>
        <button onClick={() => setEditorOpen(false)}>Close editor</button>
        <button>Change profile picture</button>
        <button>Change banner</button>
        <button>Edit HTML and CSS</button>
        <button>Make profile private</button>
      </section>
    </section>
  );

}