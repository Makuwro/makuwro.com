import React, { useEffect, useState } from "react";
import { matchPath, useLocation, useParams, Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../../styles/Profile.module.css";
import ProfileAbout from "./profile/ProfileAbout";
import ProfileArt from "./profile/ProfileArt";
import ProfileBlog from "./profile/ProfileBlog";
import ProfileCharacters from "./profile/ProfileCharacters";
import ProfileOrganizations from "./profile/ProfileOrganizations";
import ProfileStories from "./profile/ProfileStories";
import ProfileWorlds from "./profile/ProfileWorlds";

export default function Profile({shownLocation, setLocation, client, setCriticalError}) {

  const {username, tab: tabName, id} = useParams();
  const [owner, setOwner] = useState();
  const [ready, setReady] = useState(false);
  const [content, setContent] = useState(null);
  const [navChildren, setNavChildren] = useState(null);
  const location = useLocation();
  const [cache, setCache] = useState({});

  useEffect(() => {

    let mounted = true;
    (async () => {

      if (!owner && !matchPath({path: "/:username/art/:id"}, location.pathname)) {
    
        try {

          // Get the profile info from the server
          let owner = await client.getUser({username});
    
          if (owner) {
  
            if (owner.css) {
  
              const style = document.createElement("style");
              style.textContent = owner.css;
              document.head.appendChild(style);
              setStyleElem(style);
  
            }
  
            setOwner(owner);
    
          } else {
    
            document.title = "User not found / Makuwro";
            setOwner();
    
          }
    
          if (mounted) {
    
            setReady(true);
    
          }

        } catch (err) {

          setCriticalError(err);

        }
  
      }

    })();

    return () => {

      mounted = false;

    };

  }, [owner, id]);

  const currentPathName = location.pathname;
  useEffect(() => {

    // Check if we're on the same profile.
    if (currentPathName !== shownLocation.pathname) {

      setLocation(location);

    }

  }, [currentPathName]);

  useEffect(() => {

    // Make sure the user exists.
    if (owner) {

      // Select a tab.
      const tabs = {
        about: <ProfileAbout owner={owner} />,
        art: <ProfileArt owner={owner} cache={cache} setCache={setCache} client={client} styles={styles} />,
        blog: <ProfileBlog owner={owner} cache={cache} setCache={setCache} client={client} styles={styles} />,
        characters: <ProfileCharacters owner={owner} cache={cache} setCache={setCache} client={client} styles={styles} />,
        organizations: <ProfileOrganizations owner={owner} cache={cache} setCache={setCache} client={client} styles={styles} />,
        stories: <ProfileStories owner={owner} cache={cache} setCache={setCache} client={client} styles={styles} />,
        worlds: <ProfileWorlds owner={owner} cache={cache} setCache={setCache} client={client} styles={styles} />
      }
      setContent(tabs[tabName || "about"]);

      // Let's reset the nav options.
      // First, iterate through the option list.
      const profileUrlBase = `/${owner.username}`;
      const navChildren = ["About", "Art", "Blog", "Characters", "Organizations", "Stories", "Worlds"];
      for (let i = 0; navChildren.length > i; i++) {

        // Then replace the string with a Link component.
        const optionText = navChildren[i];
        const path = `${profileUrlBase}${i !== 0 ? `/${optionText.toLowerCase()}` : ""}`;
        navChildren[i] = (
          <Link
            key={path}
            className={currentPathName === path ? styles.selected : null} 
            to={path}>
              {optionText}
          </Link>
        );

        if (currentPathName === path) {

          // Update the document title.
          document.title = `${owner.displayName} (${owner.username})${i === 0 ? "" : ` / ${optionText}`}`

        }

      }

      // Replace the old nav children with the new array.
      setNavChildren(navChildren);

    }

  }, [owner, tabName]);

  return ready && (
    <main id={styles.profile}>
      <section id={styles.metadata}>
        <section id={styles.avatar}>
          <img src={"https://yt3.ggpht.com/LmbLsIs7VUZ7dJbwW9JBuKXjMrk3qmXB7oiplq5LQER4nrk7px9wcJvnYVpE065dIydMtdjz2Q=s88-c-k-c0x00ffffff-no-rj" || `https://cdn.makuwro.com/${owner.avatarPath}`} />
        </section>
        <h1>{owner.displayName || `@${owner.username}`}</h1>
        <h2>CEO of Makuwro, LLC</h2>
      </section>
      <nav>
        {navChildren}
      </nav>
      <section id={styles.content}>
        {content}
      </section>
    </main>
  );

}

Profile.propTypes = {
  shownLocation: PropTypes.object,
  notify: PropTypes.func,
  updated: PropTypes.bool,
  setLocation: PropTypes.func,
  client: PropTypes.object,
  setSettingsCache: PropTypes.func,
  setCriticalError: PropTypes.func
};