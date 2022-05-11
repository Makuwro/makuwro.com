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
import ProfileChapters from "./profile/ProfileChapters";
import Dropdown from "./input/Dropdown";

export default function Profile({shownLocation, setLocation, currentUser, notify, updated, setSettingsCache}) {

  const {username, tab, id, subtab} = useParams();
  const [leaving, setLeaving] = useState(true);
  const [shifting, setShifting] = useState(false);
  const [searchParams] = useSearchParams();
  const [profileInfo, setProfileInfo] = useState();
  const [ready, setReady] = useState(false);
  const [styleElem, setStyleElem] = useState();
  const location = useLocation();
  const [tabComponent, setTabComponent] = useState(null);
  const [isCharacter, setIsCharacter] = useState(tab === "characters" && id);
  const [isStory, setIsStory] = useState(tab === "stories" && id);
  const [navComponents, setNavComponents] = useState([]);
  const [cache, setCache] = useState({});
  const navigate = useNavigate();
  const action = searchParams.get("action");

  // Set the current view
  useEffect(() => {

    if (!matchPath({path: "/:username/art/:id"}, location.pathname)) {

      if (profileInfo && !isStory) {

        // Add links to the profile navigator
        const navChildren = [];
        let navItems = isCharacter ? [
          "About",
          "Art",
          "Stories",
          "Stats",
          "Worlds"
        ] : [
          "About",
          "Art", 
          "Blog", 
          "Characters",
          "Stats",
          "Stories", 
          "Terms", 
          "Worlds"
        ];

        for (let i = 0; navItems.length > i; i++) {

          // First, let's work on the onClick function
          const item = navItems[i];
          const itemLC = item.toLowerCase();
          const href = `/${username}${isCharacter ? `/characters/${id}` : ""}${itemLC !== "about" ? `/${itemLC}` : ""}`;
          const onClick = itemLC !== tab && itemLC !== subtab && (tab || itemLC !== "about") ? (event) => {

            // Don't go to the link quite yet, let's animate this first
            event.preventDefault();

            setShifting(true);

            // Now it's time to go to the next page
            navigate(href);

          } : null;
          const element = React.createElement(Link, {
            to: href,
            className: itemLC === tab || itemLC === subtab || ((isCharacter ? !subtab : !tab) && itemLC === "about") ? styles.selected : null,
            onClick,
            onTransitionEnd: (event) => event.stopPropagation(),
            key: itemLC,
            name: itemLC,
            draggable: false
          }, item);

          // Push it for use later
          navChildren.push(element);

        }
        setNavComponents(navChildren);

        const components = {
          about: <ProfileAbout profileInfo={profileInfo} currentUser={currentUser} isCharacter={isCharacter} />,
          art: <ProfileLibraryItem updated={updated} tab="art" profileInfo={profileInfo} currentUser={currentUser} isCharacter={isCharacter} cache={cache} setCache={setCache} />,
          stories: <ProfileLibraryItem tab="stories" profileInfo={profileInfo} currentUser={currentUser} isCharacter={isCharacter} />,
          worlds: <ProfileLibraryItem tab="worlds" profileInfo={profileInfo} currentUser={currentUser} isCharacter={isCharacter} />,
          stats: <ProfileStats profileInfo={profileInfo} currentUser={currentUser} isCharacter={isCharacter} />,
          characters: <ProfileLibraryItem tab="characters" profileInfo={profileInfo} currentUser={currentUser} />,
          terms: <ProfileTerms profileInfo={profileInfo} currentUser={currentUser} />,
          blog: <ProfileBlog profileInfo={profileInfo} currentUser={currentUser} notify={notify} />
        };  

        setTabComponent(components[(isCharacter ? subtab : tab) || "about"]);

      } else {

        if (isStory) {

          setNavComponents(null);

        }
        setTabComponent(null);

      }

    }

  }, [tab, subtab, profileInfo, isCharacter, isStory]);
  
  useEffect(() => {

    const path1 = location.pathname;
    const path2 = shownLocation.pathname;
    if (path1 !== "/signin" && path1 !== "/register") {

      const paths = ["/:username", "/:username/:tab/:id", "/:username/:tab", "/:username/:tab/:id"];
      let onProfile = false;
      let newProfile = false;

      newProfile = (
        matchPath({path: "/:username/:tab/:id"}, path1) || 
        matchPath({path: "/:username/:tab/:id/:subtab"}, path1)
      );
      for (let i = 0; paths.length > i; i++) {
 
        // Leave the page if we want to go to the settings.
        // This is why we should block the "settings" username.
        onProfile = (onProfile = matchPath({path: paths[i]}, path1))?.params.username !== "settings" ? onProfile : undefined;
        if (onProfile) break;

      }

      // Don't actually leave the page if we're just looking at art.
      if (!matchPath({path: "/:username/art/:id"}, path1) && (
        (!newProfile && (isCharacter || isStory)) || // Going to a character or story profile.
        (newProfile && !isStory && !isCharacter) || // Going to an account profile.
        (!newProfile && !isCharacter && !onProfile && !isStory)) // Leaving the profile component completely.
      ) {

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

  useEffect(() => {

    let mounted = true;
    const isCharacter = tab === "characters" && id;
    const isStory = tab === "stories" && id;

    (async () => {

      if (!profileInfo && !matchPath({path: "/:username/art/:id"}, location.pathname)) {
    
        // Get the profile info from the server
        const headers = currentUser.token ? {
          token: currentUser.token
        } : {};
        const response = await fetch(`${process.env.RAZZLE_API_DEV}${isCharacter || isStory ? `contents/${tab}/${username}/${id}` : `accounts/users/${username}`}`, {headers});
  
        if (mounted && response.ok) {
  
          const profileInfo = await response.json();
  
          if (mounted) {
  
            document.title = `${isCharacter || isStory ? profileInfo.name : (profileInfo.displayName || profileInfo.username)} on Makuwro`;
  
            if (profileInfo.css) {
  
              const style = document.createElement("style");
              style.textContent = profileInfo.css;
              document.head.appendChild(style);
              setStyleElem(style);
  
            }
  
            setProfileInfo(profileInfo);
  
          }
  
        } else if (mounted) {
  
          document.title = `${isCharacter ? "Character" : (isStory ? "Story" : "Account")} not found / Makuwro`;
          setProfileInfo();
  
        }
  
        if (mounted) {
  
          setIsCharacter(isCharacter);
          setIsStory(isStory);
          setReady(true);
  
        }
  
      }

    })();

    return () => {

      mounted = false;

    };

  }, [profileInfo, tab, id]);

  function navigateToSettings() {

    const type = isStory ? 1 : 0;
    const isNotUser = isCharacter || isStory;
    if (isNotUser) {

      setSettingsCache({...profileInfo, type});

    }
    navigate(`${isNotUser ? location.pathname : ""}/settings/${isNotUser ? "profile" : "account"}`);

  }

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
      <section>
        <section id={styles["profile-header"]}>
          <section id={styles.profileBannerContainer}>
            {profileInfo && profileInfo.bannerPath && <img src={`https://cdn.makuwro.com/${profileInfo.bannerPath}`} />}
          </section>
        </section>
        <section id={styles["profile-info"]} style={!profileInfo || isStory ? {paddingBottom: "80px"} : null}>
          <section>
            <section>
              {!isStory && (
                <img id={styles.avatar} alt={`${username}'s avatar`} src={`https://cdn.makuwro.com/${profileInfo ? profileInfo.avatarPath : "global/pfp.png"}`} />
              )}
              <section>
                <h1>
                  {profileInfo && !profileInfo.isBanned && !profileInfo.isDisabled ? (isCharacter || isStory ? profileInfo.name : (profileInfo.displayName || `@${profileInfo.username}`)) : (isCharacter || isStory ? id : `@${username}`)}
                  {profileInfo && profileInfo.isStaff && (
                    <span title="This user is a Makuwro staff member" className={styles.badge}>STAFF</span>
                  )}
                </h1>
                <h2>
                  {profileInfo && !profileInfo.isBanned && !profileInfo.isDisabled && profileInfo.displayName ? `@${profileInfo.username}` : null}
                </h2>
                {!profileInfo ? (
                  <p style={{margin: 0}}>This {isCharacter ? "character" : (isStory ? "story" : "account")} doesn't exist. {!isCharacter && !currentUser.id ? <Link to="/register">But it doesn't have to be that way ;)</Link> : ""}</p>
                ) : (profileInfo.isBanned ? (
                  <p style={{margin: 0}}>This account has been banned for violating the <a href="https://about.makuwro.com/policies/terms">terms of service</a></p>
                ) : (profileInfo.isDisabled ? 
                  <p style={{margin: 0}}>This account is currently disabled. Try again later!</p>
                  : ((isStory || isCharacter) && (
                    <Link to={`/${profileInfo.owner.username}`} id={styles.owner}>
                      <span>
                        <img src={`https://cdn.makuwro.com/${profileInfo.owner.avatarPath}`} />
                      </span>
                      {profileInfo.owner.displayName || `@${profileInfo.owner.username}`}
                    </Link>
                  ))))}
              </section>
            </section>
            {profileInfo && (
              <section id={styles.actions}>
                {currentUser && (currentUser.id === profileInfo?.id || currentUser.id === profileInfo?.owner?.id) ? (
                  <button onClick={navigateToSettings}>Settings</button>
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
          {!isStory && (
            <>
              <Dropdown index={0}>
                {navComponents.map((component) => (
                  <li key={component.props.name}>
                    {component.props.children}
                  </li>
                ))}
              </Dropdown>
              <nav id={styles.selection}>
                {navComponents}
              </nav>
            </>
          )}
        </section>
        {profileInfo && !profileInfo.isBanned && !profileInfo.isDisabled && (
          <section id={styles.container}>
            <section className={shifting ? styles.invisible : null} onTransitionEnd={(event) => {

              event.stopPropagation();
              setLocation(location);

            }}>
              {isStory ? <ProfileChapters profileInfo={profileInfo} currentUser={currentUser} /> : tabComponent}
            </section>
          </section>
        )}
      </section>
      <Footer />
    </main>
  );

}

Profile.propTypes = {
  shownLocation: PropTypes.object,
  notify: PropTypes.func,
  updated: PropTypes.bool,
  setLocation: PropTypes.func,
  currentUser: PropTypes.object,
  setSettingsCache: PropTypes.func
};