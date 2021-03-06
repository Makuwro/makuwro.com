import React, { useEffect, useState } from "react";
import { matchPath, useLocation, useParams, Link, useNavigate } from "react-router-dom";
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
import ProfileChapters from "./profile/ProfileChapters";
import { Character, Story, World } from "makuwro";
import ProfileMembers from "./profile/ProfileMembers";

export default function Profile({shownLocation, setLocation, client, setCriticalError}) {

  const {username, tab: tabName, id, subTab: subTabName} = useParams();
  const [profileType, setProfileType] = useState("user");
  const isCharacter = profileType === "character";
  const isStory = profileType === "story";
  const isWorld = profileType === "world";
  const [owner, setOwner] = useState();
  const [ready, setReady] = useState(false);
  const [content, setContent] = useState(null);
  const [navChildren, setNavChildren] = useState(null);
  const location = useLocation();
  const [cache, setCache] = useState({});
  const [useDefaultProfilePicture, setUseDefaultProfilePicture] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    // Keep track if the component unmounts.
    // This variable is outside the async function because it could turn false.
    let mounted = true;
    (async () => {

      if (matchPath({path: "/:username/:tab"}, location.pathname) || matchPath({path: "/:username"}, location.pathname)) {
    
        try {

          // Reset this.
          setUseDefaultProfilePicture(false);

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
      
      let params = (matchPath({path: "/:username/characters/:slug"}, location.pathname) || matchPath({path: "/:username/characters/:slug/:subTab"}, location.pathname))?.params;
      if (params && (profileType !== "character" || (params.slug !== owner.slug || params.username !== owner.owner?.username))) {

        // Reset this.
        setUseDefaultProfilePicture(false);
        setProfileType("character");

        try {

          let character = await client.getContent(Character, username, id);
          setOwner(character);

        } catch (err) {

          document.title = "Character not found / Makuwro";
          setOwner();
          console.error(err);

        }
        
        setReady(true);

      }

      params = (matchPath({path: "/:username/stories/:slug"}, location.pathname) || matchPath({path: "/:username/stories/:slug/:subTab"}, location.pathname))?.params;
      if (params && (profileType !== "story" || (params.slug !== owner.slug || params.username !== owner.owner?.username))) {

        // Reset this.
        setUseDefaultProfilePicture(false);
        setProfileType("story");

        try {

          let story = await client.getContent(Story, username, id);
          setOwner(story);

        } catch (err) {

          document.title = "Story not found / Makuwro";
          setOwner();
          console.error(err);

        }
        
        setReady(true);

      }

      params = (matchPath({path: "/:username/worlds/:slug"}, location.pathname) || matchPath({path: "/:username/worlds/:slug/:subTab"}, location.pathname))?.params;
      if (params && (profileType !== "world" || (params.slug !== owner.slug || params.username !== owner.owner?.username))) {

        // Reset this.
        setUseDefaultProfilePicture(false);
        setProfileType("world");

        try {

          let world = await client.getContent(World, username, id);
          setOwner(world);

        } catch (err) {

          document.title = "World not found / Makuwro";
          setOwner();
          console.error(err);

        }
        
        setReady(true);

      }

    })();

    return () => {

      // The component unmounted, so record that.
      mounted = false;

    };

  }, [owner, username, id, tabName, subTabName]);

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
        about: ProfileAbout,
        art: ProfileArt,
        blog: ProfileBlog,
        chapters: ProfileChapters,
        characters: ProfileCharacters,
        members: ProfileMembers,
        organizations: ProfileOrganizations,
        pages: ProfileAbout,
        stories: ProfileStories,
        worlds: ProfileWorlds
      }
      const tabKeys = Object.keys(tabs);
      for (let i = 0; tabKeys.length > i; i++) {

        const tabKey = tabKeys[i];
        tabs[tabKey] = React.createElement(tabs[tabKey], {
          key: tabKey, 
          owner, 
          cache, 
          setCache, 
          client,
          styles, 
          canCreate: !isStory && !isWorld && !isCharacter
        }, null);

      }

      // Delete unused tabs.
      if (isCharacter || isStory) {

        delete tabs.organizations;
        delete tabs.blog;

        if (isCharacter) {

          delete tabs.characters;
  
        } else {

          delete tabs.stories;

        }

      }

      if (isWorld) {

        delete tabs.organizations;
        delete tabs.worlds;
        delete tabs.chapters;

      } else {

        delete tabs.pages;
        delete tabs.members;

        if (!isStory) {

          delete tabs.chapters;

        }

      }

      setContent(tabs[(isCharacter || isStory || isWorld ? subTabName : tabName) || "about"]);

      // Let's reset the nav options.
      // First, iterate through the option list.
      const profileUrlBase = `/${(owner?.owner || owner).username}${isCharacter ? `/characters/${owner.slug}` : ""}${isStory ? `/stories/${owner.slug}` : ""}${isWorld ? `/worlds/${owner.slug}` : ""}`;
      const navChildren = Object.keys(tabs);
      for (let i = 0; navChildren.length > i; i++) {

        // Then replace the string with a Link component.
        const optionText = navChildren[i];
        const optionTextCapitalized = optionText[0].toUpperCase() + optionText.slice(1);
        const path = `${profileUrlBase}${i !== 0 ? `/${optionText}` : ""}`;
        navChildren[i] = (
          <Link
            key={path}
            className={currentPathName === path ? styles.selected : null} 
            to={path}>
              {optionTextCapitalized}
          </Link>
        );

        if (currentPathName === path) {

          // Update the document title.
          document.title = `${owner.title || owner.name || `${owner.displayName} (${owner.username})`}${i === 0 ? "" : ` / ${optionTextCapitalized}`}`

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
        {owner && (!useDefaultProfilePicture || (!isStory && !isWorld)) && (
          <section id={styles.avatar}>
            <img src={`https://cdn.makuwro.com/${useDefaultProfilePicture ? "global/pfp.png" : `${(owner?.owner || owner).id}${isCharacter ? `/characters/${owner.id}` : (isStory ? `/stories/${owner.id}` : isWorld ? `/worlds/${owner.id}` : "")}/avatar`}`} onError={() => setUseDefaultProfilePicture(true)} />
          </section>
        )}
        <h1>{owner ? (owner.title || owner.name || owner.displayName || `@${owner.username}`) : `${profileType[0].toUpperCase()}${profileType.slice(1)} not found`}</h1>
        {!isWorld && !isStory && (
          <h2>{owner ? "CEO of Makuwro, LLC" : "But don't worry: they'll come around some day."}</h2>
        )}
        <section id={styles.actions}>
          {owner && ((owner?.owner || owner).id === client.user?.id) ? (
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
                      {!isCharacter && (
                        <button>
                          Block
                        </button>
                      )}
                      <button onClick={() => navigate(`${currentPathName}?action=report-abuse`)}>
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
      <section id={styles.navContainer}>
        <nav>
          {navChildren}
        </nav>
      </section>
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