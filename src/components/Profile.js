import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../styles/Profile.module.css";
import Footer from "./Footer";
import ProfileLibraryItem from "./profile/ProfileLibraryItem";
import ProfileStats from "./profile/ProfileStats";
import ProfileTerms from "./profile/ProfileTerms";
import ProfileBlog from "./profile/ProfileBlog";

export default function Profile({shownLocation, setLocation, currentUser}) {

  const {username, tab, id} = useParams();
  const state = {
    displayName: useState(username),
    disabled: useState(false)
  };
  const [editorOpen, setEditorOpen] = useState(false);
  const [leaving, setLeaving] = useState(true);
  const [shifting, setShifting] = useState(false);
  const [searchParams] = useSearchParams();
  const [profileInfo, setProfileInfo] = useState();
  const [ready, setReady] = useState(false);
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
    art: <ProfileLibraryItem tab="art" profileInfo={profileInfo} currentUser={currentUser} />,
    literature: <ProfileLibraryItem tab="literature" profileInfo={profileInfo} currentUser={currentUser} />,
    worlds: <ProfileLibraryItem tab="worlds" profileInfo={profileInfo} currentUser={currentUser} />,
    teams: <ProfileLibraryItem tab="teams" profileInfo={profileInfo} currentUser={currentUser} />,
    stats: <ProfileStats profileInfo={profileInfo} currentUser={currentUser} />,
    characters: <ProfileLibraryItem tab="characters" profileInfo={profileInfo} currentUser={currentUser} />,
    terms: <ProfileTerms profileInfo={profileInfo} currentUser={currentUser} />,
    blog: <ProfileBlog profileInfo={profileInfo} currentUser={currentUser} />
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

      }

    }

  }, [action, location]);

  useEffect(async () => {

    // Get the profile info from the server
    const headers = currentUser.token ? {
      token: currentUser.token
    } : {};
    const response = await fetch(`${process.env.RAZZLE_API_DEV}accounts/users/${username}`, {headers});

    if (response.ok) {

      setProfileInfo(await response.json());

    }

    setReady(true);
    setLeaving(false);

  }, [currentUser]);

  return ready ? (
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
          <section id={styles["profile-info"]}>
            {!isLiterature && (
              <img src={profileInfo ? profileInfo.avatarPath : ""} />
            )}
            <section>
              <h1>
                {profileInfo ? (profileInfo.displayName || `@${profileInfo.username}`) : `@${username}`}
                {!isLiterature && profileInfo && profileInfo.isStaff && (
                  <span title="This user is a Makuwro staff member" className={styles["profile-badge"]}>STAFF</span>
                )}
              </h1>
              <h2>
                {isLiterature ? state.displayName[0] : (profileInfo && profileInfo.displayName ? `@${profileInfo.username}` : null)}
              </h2>
              {!profileInfo ? (
                <p style={{margin: 0}}>This account doesn't exist</p>
              ) : (profileInfo.isBanned ? (
                <p style={{margin: 0}}>This account has been banned for violating the <a href="https://about.makuwro.com/policies/terms">terms of service</a></p>
              ) : null)}
            </section>
          </section>
        </section>
        {profileInfo && !profileInfo.isBanned && (
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
                  currentUser.username === username ? (
                    <>
                      <button onClick={() => navigate("?action=edit-profile")}>Edit profile</button>
                    </>
                  ) : (
                    <>
                      <button>Follow</button>
                      <button>Message</button>
                      <button className="destructive">Block</button>
                    </>
                  )
                )}
                <button className="destructive" onClick={() => navigate("?action=report-abuse")}>Report</button>
              </section>
            </section>
          </section>
        )}
        <Footer />
      </main>
      <section id={styles.profileEditorOptions}>
        <button onClick={() => navigate(location.pathname)}>Close editor</button>
        <button>Change profile picture</button>
        <button>Change banner</button>
        <button>Edit about me</button>
      </section>
    </section>
  ) : <>loading</>;

}

Profile.propTypes = {
  setLocation: PropTypes.func,
  currentUser: PropTypes.object
};