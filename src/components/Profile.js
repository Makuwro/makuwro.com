import React, { useEffect, useState } from "react";
import { Link, matchPath, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../styles/Profile.module.css";
import Footer from "./Footer";
import ProfileLibraryItem from "./profile/ProfileLibraryItem";
import ProfileStats from "./profile/ProfileStats";
import ProfileTerms from "./profile/ProfileTerms";
import ProfileBlog from "./profile/ProfileBlog";
import ProfileAbout from "./profile/ProfileAbout";

export default function Profile({shownLocation, setLocation, currentUser, notify, updated}) {

  const {username, tab, id, subtab} = useParams();
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
  const [isCharacter, setIsCharacter] = useState(tab === "characters" && id);
  const [navComponents, setNavComponents] = useState([]);
  let isLiterature;
  let action;

  // Set the current view
  useEffect(() => {

    if (profileInfo) {

      // Add links to the profile navigator
      const navChildren = [];
      const navItems = isCharacter ? [
        "About",
        "Art",
        "Literature",
        "Stats",
        "Worlds"
      ] : [
        "About",
        "Art", 
        "Blog", 
        "Characters",
        "Literature", 
        "Stats",
        "Terms", 
        "Worlds"
      ];
      for (let i = 0; navItems.length > i; i++) {

        // First, let's work on the onClick function
        const item = navItems[i];
        const itemLC = item.toLowerCase();
        const href = `/${username}${isCharacter ? `/characters/${id}` : ""}${itemLC !== "about" ? `/${itemLC}` : ""}`;
        const onClick = (event) => {

          // Don't go to the link quite yet, let's animate this first
          event.preventDefault();

          setShifting(true);

          // Now it's time to go to the next page
          navigate(href);

        };
        const element = React.createElement(Link, {
          to: href,
          className: itemLC === tab || itemLC === subtab || ((isCharacter ? !subtab : !tab) && itemLC === "about") ? styles.selected : null,
          onClick: itemLC !== tab && itemLC !== subtab && (tab || itemLC !== "about") ? onClick : null,
          onTransitionEnd: (event) => event.stopPropagation(),
          key: itemLC,
          draggable: false
        }, item);

        // Push it for use later
        navChildren.push(element);

      }
      setNavComponents(navChildren);

      const components = {
        about: <ProfileAbout profileInfo={profileInfo} currentUser={currentUser} isCharacter={isCharacter} />,
        art: <ProfileLibraryItem updated={updated} tab="art" profileInfo={profileInfo} currentUser={currentUser} isCharacter={isCharacter} />,
        literature: <ProfileLibraryItem tab="literature" profileInfo={profileInfo} currentUser={currentUser} isCharacter={isCharacter} />,
        worlds: <ProfileLibraryItem tab="worlds" profileInfo={profileInfo} currentUser={currentUser} isCharacter={isCharacter} />,
        stats: <ProfileStats profileInfo={profileInfo} currentUser={currentUser} isCharacter={isCharacter} />,
        characters: <ProfileLibraryItem tab="characters" profileInfo={profileInfo} currentUser={currentUser} />,
        terms: <ProfileTerms profileInfo={profileInfo} currentUser={currentUser} />,
        blog: <ProfileBlog profileInfo={profileInfo} currentUser={currentUser} notify={notify} />
      };  

      setTabComponent(components[(isCharacter ? subtab : tab) || "about"]);

    } else {

      setTabComponent(null);

    }

  }, [tab, subtab, profileInfo, isCharacter]);
  
  action = searchParams.get("action");
  useEffect(() => {

    const path1 = location.pathname;
    const path2 = shownLocation.pathname;
    if (path1 !== "/signin" && path1 !== "/register") {

      const paths = ["/:username", "/:username/:tab/:id", "/:username/:tab", "/:username/:tab/:id"];
      let onProfile = false;
      let newProfile = false;

      newProfile = matchPath({path: "/:username/characters/:id"}, path1) || matchPath({path: "/:username/:tab/:id/:subtab"}, path1);
      for (let i = 0; paths.length > i; i++) {

        onProfile = (onProfile = matchPath({path: paths[i]}, path1))?.params.username !== "settings" ? onProfile : undefined;
        if (onProfile) break;

      }

      if (!matchPath({path: "/:username/art/:id"}, path1) && ((newProfile && !isCharacter) || (!newProfile && isCharacter) || (!newProfile && !isCharacter && !onProfile))) {

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

    let mounted = true;
    const isCharacter = tab === "characters" && id;

    if (!profileInfo || !matchPath({path: "/:username/art/:id"}, location.pathname)) {
    
      // Get the profile info from the server
      const headers = currentUser.token ? {
        token: currentUser.token
      } : {};
      const response = await fetch(`${process.env.RAZZLE_API_DEV}${isCharacter ? `contents/${tab}/${username}/${id}` : `accounts/users/${username}`}`, {headers});

      if (mounted && response.ok) {

        const profileInfo = await response.json();

        if (mounted) {

          document.title = `${isCharacter ? profileInfo.name : (profileInfo.displayName || profileInfo.username)} on Makuwro`;

          if (profileInfo.css) {

            const style = document.createElement("style");
            style.textContent = profileInfo.css;
            document.head.appendChild(style);
            setStyleElem(style);

          }

          setProfileInfo(profileInfo);

        }

      } else {

        document.title = `${isCharacter ? "Character" : "Account"} not found / Makuwro`;

      }

      if (mounted) {

        setIsCharacter(isCharacter);
        setReady(true);

      }

    }

    return () => {

      mounted = false;

    };

  }, [username, tab, id]);

  return ready && (
    <main id={styles.profile} className={leaving ? "leaving" : ""} onTransitionEnd={() => {

      if (leaving) {

        if (styleElem) {

          styleElem.parentNode.removeChild(styleElem);
          setStyleElem();

        }
        setReady(false);
        setProfileInfo();
        setLocation(location);

      }

    }}>
      <section id={styles["profile-header"]}>
        <section id={styles.profileBannerContainer}>
          {profileInfo && profileInfo.bannerPath && <img src={`https://cdn.makuwro.com/${profileInfo.bannerPath}`} />}
        </section>
      </section>
      <section id={styles["profile-info"]} style={isCharacter && !profileInfo ? {marginBottom: "48px"} : null}>
        {!isLiterature && (
          <img alt={`${username}'s avatar`} src={`https://cdn.makuwro.com/${profileInfo ? profileInfo.avatarPath : "global/pfp.png"}`} />
        )}
        <section>
          <h1>
            {profileInfo && !profileInfo.isBanned && !profileInfo.isDisabled ? (isCharacter ? profileInfo.name : (profileInfo.displayName || `@${profileInfo.username}`)) : (isCharacter ? id : `@${username}`)}
            {profileInfo && profileInfo.isStaff && (
              <span title="This user is a Makuwro staff member" className={styles["profile-badge"]}>STAFF</span>
            )}
          </h1>
          <h2>
            {isLiterature ? state.displayName[0] : (profileInfo && !profileInfo.isBanned && !profileInfo.isDisabled && profileInfo.displayName ? `@${profileInfo.username}` : null)}
          </h2>
          {!profileInfo ? (
            <p style={{margin: 0}}>This {isCharacter ? "character" : "account"} doesn't exist. {!isCharacter && !currentUser.id ? <Link to="/register">But it doesn't have to be that way ;)</Link> : ""}</p>
          ) : (profileInfo.isBanned ? (
            <p style={{margin: 0}}>This account has been banned for violating the <a href="https://about.makuwro.com/policies/terms">terms of service</a></p>
          ) : (profileInfo.isDisabled ? 
            <p style={{margin: 0}}>This account is currently disabled. Try again later!</p>
            : (isCharacter && (
              <Link to={`/${profileInfo.owner.username}`} id={styles.owner}>
                <span>
                  <img src={`https://cdn.makuwro.com/${profileInfo.owner.avatarPath}`} />
                </span>
                {profileInfo.owner.displayName || `@${profileInfo.owner.username}`}
              </Link>
            ))))}
        </section>
        {profileInfo && (
          <section id={styles.actions}>
            {currentUser && (currentUser.id === profileInfo?.id || currentUser.id === profileInfo?.owner?.id) ? (
              <button onClick={() => navigate(`/${isCharacter ? `${profileInfo.owner.username}/characters/${profileInfo.slug}/` : ""}settings/${isCharacter ? "profile" : "account"}`)}>Settings</button>
            ) : (
              <>
                <button onClick={() => currentUser?.id ? navigate("?action=follow") : navigate("/signin")}>Follow</button>
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
            {navComponents}
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