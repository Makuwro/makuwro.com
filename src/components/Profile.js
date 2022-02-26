import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../styles/Profile.module.css";
import Footer from "./Footer";
import ProfileLibraryItem from "./profile/ProfileLibraryItem";
import ProfileStats from "./profile/ProfileStats";
import ProfileTerms from "./profile/ProfileTerms";
import ProfileBlog from "./profile/ProfileBlog";
import ProfileAbout from "./profile/ProfileAbout";

export default function Profile({shownLocation, setLocation, currentUser, notify, updated}) {

  const {username, tab, id} = useParams();
  const state = {
    displayName: useState(username),
    disabled: useState(false)
  };
  const [leaving, setLeaving] = useState(true);
  const [shifting, setShifting] = useState(false);
  const [searchParams] = useSearchParams();
  const [profileInfo, setProfileInfo] = useState();
  const [ready, setReady] = useState(false);
  const [styleElem, setStyleElem] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const [tabComponent, setTabComponent] = useState(null);
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
    "About",
    "Art", 
    "Blog", 
    "Characters",
    "Folders",
    "Literature", 
    "Stats",
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
      navigate(`/${username}${itemLC !== "about" ? `/${itemLC}` : ""}`);

    };
    const element = React.createElement(Link, {
      to: `/${username}${itemLC !== "about" ? (`/${isLiterature ? `literature/${id}/` : ""}${itemLC}`) : ""}`,
      className: itemLC === tab || (!tab && itemLC === "about") ? styles.selected : null,
      onClick: itemLC !== tab && (tab || itemLC !== "about") ? onClick : null,
      onTransitionEnd: (event) => event.stopPropagation(),
      key: itemLC
    }, item);

    // Push it for use later
    navChildren.push(element);

  }

  // Set the current view
  useEffect(() => {

    const components = {
      about: <ProfileAbout profileInfo={profileInfo} currentUser={currentUser} />,
      art: <ProfileLibraryItem updated={updated} tab="art" profileInfo={profileInfo} currentUser={currentUser} />,
      literature: <ProfileLibraryItem tab="literature" profileInfo={profileInfo} currentUser={currentUser} />,
      worlds: <ProfileLibraryItem tab="worlds" profileInfo={profileInfo} currentUser={currentUser} />,
      stats: <ProfileStats profileInfo={profileInfo} currentUser={currentUser} />,
      characters: <ProfileLibraryItem tab="characters" profileInfo={profileInfo} currentUser={currentUser} />,
      terms: <ProfileTerms profileInfo={profileInfo} currentUser={currentUser} />,
      blog: <ProfileBlog profileInfo={profileInfo} currentUser={currentUser} notify={notify} />
    };  

    setTabComponent(components[tab || "about"]);

  }, [tab, profileInfo]);
  
  action = searchParams.get("action");
  useEffect(() => {

    const path1 = location.pathname;
    const path2 = shownLocation.pathname;
    const length = username.length + 1;
    if (path1 !== "/signin" && path1 !== "/register") {

      if ((path1.substring(0, length) !== path2.substring(0, length)) || /^\/(?<username>[^/]+)\/blog\/(?<slug>[^/]+)\/?$/gm.test(path1)) {

        setLeaving(true);

      }

    }

    if (path1 === path2) {

      setShifting(false);

    }

  }, [action, location, shownLocation]);

  useEffect(() => {

    if (ready) {
      
      setTimeout(() => setLeaving(false), 0);

    }

  }, [ready]);

  useEffect(async () => {

    // Get the profile info from the server
    const headers = currentUser.token ? {
      token: currentUser.token
    } : {};
    const response = await fetch(`${process.env.RAZZLE_API_DEV}accounts/users/${username}`, {headers});

    if (response.ok) {

      const profileInfo = await response.json();
      document.title = `${profileInfo.displayName || profileInfo.username} on Makuwro`;

      if (profileInfo.css) {

        const style = document.createElement("style");
        style.textContent = profileInfo.css;
        document.head.appendChild(style);
        setStyleElem(style);

      }

      setProfileInfo(profileInfo);

    } else {

      document.title = "Account not found / Makuwro";

    }

    setReady(true);

  }, [username]);

  return ready && (
    <main id={styles.profile} className={`${isLiterature ? styles.literature : null} ${leaving ? "leaving" : ""}`} onTransitionEnd={() => {

      if (leaving) {

        if (styleElem) {

          styleElem.parentNode.removeChild(styleElem);
          setStyleElem();

        }
        setLocation(location);

      }

    }}>
      <section id={styles["profile-header"]}>
        <section id={styles.profileBannerContainer}>
          {profileInfo && profileInfo.bannerPath && <img src={`https://cdn.makuwro.com/${profileInfo.bannerPath}`} />}
        </section>
      </section>
      <section id={styles["profile-info"]}>
        {!isLiterature && (
          <img src={`https://cdn.makuwro.com/${profileInfo ? profileInfo.avatarPath : "global/pfp.png"}`} />
        )}
        <section>
          <h1>
            {profileInfo && !profileInfo.isBanned && !profileInfo.isDisabled ? (profileInfo.displayName || `@${profileInfo.username}`) : `@${username}`}
            {!isLiterature && profileInfo && profileInfo.isStaff && (
              <span title="This user is a Makuwro staff member" className={styles["profile-badge"]}>STAFF</span>
            )}
          </h1>
          <h2>
            {isLiterature ? state.displayName[0] : (profileInfo && !profileInfo.isBanned && !profileInfo.isDisabled && profileInfo.displayName ? `@${profileInfo.username}` : null)}
          </h2>
          {!profileInfo ? (
            <p style={{margin: 0}}>This account doesn't exist. {!currentUser.id ? <Link to="/register">But it doesn't have to be that way ;)</Link> : ""}</p>
          ) : (profileInfo.isBanned ? (
            <p style={{margin: 0}}>This account has been banned for violating the <a href="https://about.makuwro.com/policies/terms">terms of service</a></p>
          ) : (profileInfo.isDisabled && 
            <p style={{margin: 0}}>This account is currently disabled. Try again later!</p>
          ))}
        </section>
        {profileInfo && (
          <section id={styles.actions}>
            {currentUser && currentUser.id === profileInfo.id ? (
              <button onClick={() => navigate("/settings/account")}>Settings</button>
            ) : (
              <>
                <button onClick={() => currentUser.id ? navigate("?action=follow") : navigate("/signin")}>Follow</button>
                <button className="destructive" onClick={() => navigate("?action=block")}>Block</button>
                <button className="destructive" onClick={() => navigate("?action=report-abuse")}>Report</button>
              </>
            )}
          </section>
        )}
      </section>
      {profileInfo && !profileInfo.isBanned && !profileInfo.isDisabled && (
        <section id={styles.container}>
          <nav id={styles.selection}>
            {navChildren}
          </nav>
          <section className={shifting ? styles.invisible : null} onTransitionEnd={(event) => {

            event.stopPropagation();
            setLocation(location);

          }}>
            {tabComponent}
          </section>
        </section>
      )}
      <Footer />
    </main>
  );

}

Profile.propTypes = {
  shownLocation: PropTypes.object,
  notify: PropTypes.func,
  updated: PropTypes.bool,
  setLocation: PropTypes.func,
  currentUser: PropTypes.object
};