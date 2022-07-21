import React, { useEffect, useState } from "react";
import { matchPath, useLocation, useParams, Link } from "react-router-dom";
import { AccountNotFoundError } from "makuwro-errors";
import PropTypes from "prop-types";
import styles from "../styles/Profile.module.css";
import ProfileAbout from "./profile/ProfileAbout";
import ProfileArt from "./profile/ProfileArt";
import ProfileBlog from "./profile/ProfileBlog";
import ProfileCharacters from "./profile/ProfileCharacters";
import ProfileOrganizations from "./profile/ProfileOrganizations";
import ProfileStories from "./profile/ProfileStories";
import ProfileWorlds from "./profile/ProfileWorlds";

export default function Profile({shownLocation, setLocation, client, setCriticalError}) {

  const {username, tab: tabName, id, subTab: subTabName} = useParams();
  const [profileType, setProfileType] = useState("user");
  const [owner, setOwner] = useState();
  const [ready, setReady] = useState(false);
  const [content, setContent] = useState(null);
  const [navChildren, setNavChildren] = useState(null);
  const location = useLocation();
  const [cache, setCache] = useState({});

  useEffect(() => {

    let mounted = true;
    (async () => {

      if (matchPath({path: "/:username/:tab"}, location.pathname) || matchPath({path: "/:username"}, location.pathname)) {
    
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
    
          }
    
          if (mounted) {
    
            setProfileType("user");
            setReady(true);
    
          }

        } catch (err) {

          if (err instanceof AccountNotFoundError) {

            document.title = "User not found / Makuwro";
            setOwner();
            setReady(true);

          } else {

            setCriticalError(err);

          }

        }

        return;
  
      }
      
      const params = (matchPath({path: "/:username/characters/:slug"}, location.pathname) || matchPath({path: "/:username/characters/:slug/:subTab"}, location.pathname))?.params;
      if (params && (profileType !== "character" || (params.slug !== owner.slug || params.username !== owner.owner?.username))) {

        try {

          let character = await client.getCharacter(username, id);
          setProfileType("character");
          setOwner(character);
          setReady(true);

        } catch (err) {

          console.error(err);

        }

      }

    })();

    return () => {

      mounted = false;

    };

  }, [owner, username, id, tabName]);

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
        about: <ProfileAbout owner={owner} styles={styles} />,
        art: <ProfileArt owner={owner} cache={cache} setCache={setCache} client={client} styles={styles} />,
        blog: <ProfileBlog owner={owner} cache={cache} setCache={setCache} client={client} styles={styles} />,
        characters: <ProfileCharacters owner={owner} cache={cache} setCache={setCache} client={client} styles={styles} />,
        organizations: <ProfileOrganizations owner={owner} cache={cache} setCache={setCache} client={client} styles={styles} />,
        stories: <ProfileStories owner={owner} cache={cache} setCache={setCache} client={client} styles={styles} />,
        worlds: <ProfileWorlds owner={owner} cache={cache} setCache={setCache} client={client} styles={styles} />
      }

      if (profileType === "character") {

        delete tabs.blog;
        delete tabs.characters;
        delete tabs.organizations;

      }

      setContent(tabs[subTabName || tabName || "about"]);

      // Let's reset the nav options.
      // First, iterate through the option list.
      const isCharacter = profileType === "character";
      const profileUrlBase = `/${(isCharacter ? owner.owner : owner).username}${isCharacter ? `/characters/${owner.slug}` : ""}`;
      const navChildren = Object.keys(tabs);
      for (let i = 0; navChildren.length > i; i++) {

        // Then replace the string with a Link component.
        const optionText = navChildren[i];
        const path = `${profileUrlBase}${i !== 0 ? `/${optionText}` : ""}`;
        navChildren[i] = (
          <Link
            key={path}
            className={currentPathName === path ? styles.selected : null} 
            to={path}>
              {optionText[0].toUpperCase() + optionText.slice(1)}
          </Link>
        );

        if (currentPathName === path) {

          // Update the document title.
          document.title = `${owner.name || `${owner.displayName} (${owner.username})`}${i === 0 ? "" : ` / ${optionText}`}`

        }

      }

      // Replace the old nav children with the new array.
      setNavChildren(navChildren);

    }

  }, [owner, tabName, profileType, subTabName]);

  const [actionMenuOpen, setActionMenuOpen] = useState(false);

  return ready && (
    <main id={styles.profile}>
      <section id={styles.metadata}>
        {owner && (
          <section id={styles.avatar}>
            <img src={`https://cdn.makuwro.com/${owner.id}/avatar`} />
          </section>
        )}
        <h1>{owner ? (owner.name || owner.displayName || `@${owner.username}`) : "User not found"}</h1>
        <h2>{owner ? "CEO of Makuwro, LLC" : "But don't worry: they'll come around some day."}</h2>
        <section id={styles.actions}>
          {owner && owner.id === client.user?.id ? (
            <button>Edit profile</button>
          ) : (
            <>
              <button id={styles.followButton}>{owner ? "Follow" : "Go home"}</button>
              {owner && (
                <section id={styles.otherActions}>
                  <button onClick={() => setActionMenuOpen(!actionMenuOpen)}>
                    <span className="material-icons-round">
                      more_vert
                    </span>
                  </button>
                  <section id={styles.otherActionsMenu} className={actionMenuOpen ? styles.open : null} onClick={() => setActionMenuOpen(false)}>
                    <section>
                      <button>
                        Block
                      </button>
                      <button>
                        Report
                      </button>
                    </section>
                  </section>
                </section>
              )}
            </>
          )}
        </section>
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