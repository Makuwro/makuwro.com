import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../styles/Profile.module.css";
import Footer from "./Footer";
import ProfileLibraryItem from "./profile/ProfileLibraryItem";
import ProfileStats from "./profile/ProfileStats";
import ProfileTerms from "./profile/ProfileTerms";
import ProfileBlog from "./profile/ProfileBlog";

export default function Profile({shownLocation, setLocation}) {

  const {username, tab, id} = useParams();
  const state = {
    displayName: useState(username),
    disabled: useState(false)
  };
  const [editorOpen, setEditorOpen] = useState(false);
  const [leaving, setLeaving] = useState(true);
  const [shifting, setShifting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  let components;
  let tabComponent;
  let i;
  let navChildren;
  let navItems;
  let isLiterature;
  let action;

  // Add links to the profile navigator
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
    const item = navItems[i];
    const itemLC = item.toLowerCase();
    const onClick = (event) => {

      // Don't go to the link quite yet, let's animate this first
      event.preventDefault();

      setShifting(true);

      // Now it's time to go to the next page
      navigate(`/${username}/${itemLC}${editorOpen ? "?action=edit-profile" : ""}`);

    };
    const element = React.createElement(Link, {
      to: `/${username}/${isLiterature ? `literature/${id}/` : ""}${itemLC}`,
      className: itemLC === tab ? "selected" : null,
      onClick: itemLC !== tab ? onClick : null,
      onTransitionEnd: (event) => event.stopPropagation(),
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
  action = searchParams.get("action");
  useEffect(() => {

    if (action === "edit-profile") {

      setEditorOpen(true);
      document.title = "Editing your profile";

    } else {

      setEditorOpen(false);
      document.title = `${username} on Makuwro`;

    }

    if (location.pathname !== "/signin" && location.pathname !== "/register") {

      if (location.pathname.substring(0, username.length + 1) !== shownLocation.pathname.substring(0, username.length + 1)) {

        setLeaving(true);

      } else {

        setLeaving(false);

      }

    }

  }, [action, location]);

  return (
    <section id={styles.profileEditor} className={`${editorOpen ? styles.open : null} ${leaving ? styles.leaving : null}`} onTransitionEnd={() => {

      if (leaving) {

        setLocation(location);

      }

    }}>
      <main id={styles.profile} className={isLiterature ? styles.literature : null}>
        <section id={styles["profile-header"]}>
          <section id={styles.profileBannerContainer}>
            {/*<img src="https://i1.sndcdn.com/visuals-000205406223-miu7o4-t2480x520.jpg" />*/}
          </section>
          <button id={styles["profile-btn-edit"]} onClick={() => navigate("?action=edit-profile")}>Edit profile</button>
          <section id={styles["profile-info"]}>
            {!isLiterature && (
              <img src="https://pbs.twimg.com/profile_images/1477875323953991682/MM_ZZPTh_400x400.jpg" />
            )}
            <section>
              <h1>
                {state.displayName[0]}
                {!isLiterature && (
                  <span title="This user is a Makuwro staff member" className={styles["profile-badge"]}>STAFF</span>
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
            <section className={shifting ? styles.invisible : null} onTransitionEnd={(event) => {

              event.stopPropagation();
              setShifting(false);
              setLocation(location);

            }}>
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
        <button onClick={() => navigate(location.pathname)}>Close editor</button>
        <button>Change profile picture</button>
        <button>Change banner</button>
        <button>Edit about me</button>
        <button>Manage pages</button>
        <button>Edit HTML and CSS</button>
        <button>Make profile private</button>
      </section>
    </section>
  );

}

Profile.propTypes = {
  setLocation: PropTypes.func
};