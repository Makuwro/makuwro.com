import React, { useEffect, useState } from "react";
import { Link, matchPath, useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "../styles/Settings.module.css";
import pjson from "../../package.json"; 
import AccountSettings from "./settings/AccountSettings";
import AppearanceSettings from "./settings/AppearanceSettings";
import PrivacySettings from "./settings/PrivacySettings";
import ProfileSettings from "./settings/ProfileSettings";
import PropTypes from "prop-types";
import SharingSettings from "./settings/SharingSettings";
import { Client } from "makuwro";

/**
 * 
 * @param {object} props
 * @param {Client} props.client
 * @returns 
 */
export default function Settings({client, setLocation, setSettingsCache, settingsCache, setImageUrl}) {

  const {username, slug, category, tab} = useParams();
  const [menu, setMenu] = useState();
  const [leaving, setLeaving] = useState(true);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [story, setStory] = useState();
  const [blogPost, setBlogPost] = useState();
  const [article, setArticle] = useState();
  const [character, setCharacter] = useState();
  const [menuComponents, setMenuComponents] = useState(null);
  const [tabComp, setTabComp] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const {user} = client;
  let i;

  function toggleMenu(index) {

    if (index === menu) {

      setMenu();

    } else {

      setMenu(index);

    }

  }

  async function updateAccount(event, key, value, resetFields, password, passwordAgain) {

    // Don't refresh the page, please.
    event.preventDefault();

    if (key === "newPassword" && passwordAgain !== value) {

      return alert("Your password doesn't match!");

    }


    if (!submitting && value !== (character || user)[key]) {

      // Prevent multiple requests while we do this.
      setSubmitting(true);
        
      try {

        // Turn it into a FormData object.
        const formData = new FormData();
        formData.append(key, value);
        if (key === "newPassword" || key === "email" || key === "isDisabled") {

          formData.append("password", password);

        }

        // Send the request to change the value.
        await client.requestREST(`${character ? `contents/characters/${character.owner.username}/${character.slug}` : "accounts/user"}`, {
          method: "PATCH",
          body: formData
        });
        
        if (key !== "isDisabled") {

          alert("Saved!");

        }

        // Reset the field.
        resetFields();

        // Close the menu.
        setMenu();

        // We can submit requests again!
        setSubmitting(false);

        return true;

      } catch (err) {

        alert(err.message);

      }

      // We can submit requests again!
      setSubmitting(false);

    }

  }

  async function signOut() {

    if (confirm("Are you sure you want to sign out?")) {

      try {

        // Send a request to invalidate this cookie
        await client.deleteSessionToken();

        // Delete the token cookie
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Redirect to the home page
        navigate("/");

      } catch (err) {

        alert("Couldn't sign you out");

      }

    }

  }

  async function deleteCharacter() {

    let characterName;
    while (characterName !== null && (!characterName || characterName.toLowerCase() !== character.name.toLowerCase())) {

      characterName = prompt(`Are you sure you want to delete this character? We'll remove their stats, their avatar, their about page, and their tags. \n\nNo takesies-backsies! Type ${character.name}'s name to confirm.`);

    }

    if (characterName) {
    
      try {

        await client.requestREST(`contents/characters/${character.owner.username}/${character.slug}`, {
          method: "DELETE"
        });

        alert("And they're outta here!");
        navigate(`/${character.owner.username}`);

      } catch (err) {

        alert(`Couldn't delete your character: ${err.message}`);

      }

    }

  }

  useEffect(() => {

    (async () => {

      let story;
      let blogPost;
      let article;
      let character;

      if (!user) {

        // Can't manage settings if there are no settings.
        navigate(`/signin?redirect=${location.pathname}`, {replace: true});

      } 

      if (settingsCache) {

        switch (settingsCache.type) {

          // Character
          case 0:
            character = settingsCache;
            break;

          // Story
          case 1: 
            story = settingsCache;
            break;

          // Blog post
          case 2:
            blogPost = settingsCache;
            break;

          // Wiki article
          case 3:
            article = settingsCache;
            break;
          
          default:
            break;

        }   

      } else if (category && username && slug) {

        try {

          const content = await client[`get${category}`](username, slug);

          switch (category) {

            case "characters":
              character = content;
              break;
            
            case "blog":
              blogPost = content;
              break;
            
            default:
              break;

          }

        } catch (err) {

          alert("Sorry, I couldn't find that one!");

        }

      }

      setCharacter(character);
      setStory(story);
      setBlogPost(blogPost);
      setArticle(article);
      setReady(true);
      
    })();
    
  }, [username, slug, category]);

  useEffect(() => {

    if (ready && (matchPath({path: "/settings/:tab"}, location.pathname) || matchPath({path: "/:username/:category/:slug/settings/:tab"}, location.pathname))) {

      setLeaving(false);
      setLocation(location);

    } else {

      setLeaving(true);

    }

  }, [location, ready]);

  useEffect(() => {

    if (ready) {

      const tabs = {
        "account": <AccountSettings 
          client={client} 
          menu={menu} 
          setMenu={setMenu} 
          submitting={submitting}
          updateAccount={updateAccount} />,
        "profile": <ProfileSettings 
          client={client} 
          menu={menu} 
          toggleMenu={toggleMenu} 
          submitting={submitting}
          updateAccount={updateAccount}
          character={character}
          setImageUrl={setImageUrl} />,
        "appearance": <AppearanceSettings 
          client={client}
          menu={menu}
          toggleMenu={toggleMenu} />,
        "privacy": <PrivacySettings 
          client={client} 
          menu={menu}
          toggleMenu={toggleMenu} />,
        "sharing": <SharingSettings
          client={client}
          menu={menu}
          blogPost={blogPost}
          toggleMenu={toggleMenu}
        />
      };

      if (!tabs[tab]) {

        if (character) {
  
          navigate(`/${character.owner.username}/characters/${character.slug}/settings/profile`, {replace: true});
  
        } else if (blogPost) {
  
          navigate(`/${blogPost.owner.username}/blog/${blogPost.slug}/settings/sharing`, {replace: true});
  
        } else {
  
          navigate(`/settings/account${location.search}`, {replace: true});
  
        }
  
      } else {
  
        setTabComp(tabs[tab]);
  
      }

    }

  }, [tab, ready, menu]);

  useEffect(() => {

    let menuOptions;
    let pathPrefix;

    if (character) {

      menuOptions = ["Profile", "Sharing"];
      pathPrefix = `/${character.owner.username}/characters/${character.slug}/settings/`;

    } else if (blogPost) {

      menuOptions = ["Sharing"];
      pathPrefix = `/${blogPost.owner.username}/blog/${blogPost.slug}/settings/`;
      
    } else {
      
      menuOptions = ["Account", "Profile", "Appearance", "Privacy"];
      pathPrefix = "/settings/";

    }

    for (i = 0; menuOptions.length > i; i++) {

      const name = menuOptions[i];
      const path = `${pathPrefix}${name.toLowerCase().replaceAll(" ", "-")}`;
  
      menuOptions[i] = (
        <li key={i}>
          <Link to={`${path}${location.search}`} className={path === location.pathname ? styles.selected : ""} onClick={() => setMenu()}>
            {name}
          </Link>
        </li>
      );
  
    }
    setMenuComponents(menuOptions);

  }, [character, blogPost, location]);

  return ready ? (
    <main id={styles.settings} className={leaving ? "leaving" : ""} onTransitionEnd={() => {

      if (leaving) {

        setSettingsCache();
        setLocation(location);

      }

    }}>
      <section id={styles.left}>
        <ul>
          {menuComponents}
          <li><button onClick={character ? deleteCharacter : signOut}>{character ? "Delete character" : (blogPost ? "Delete blog post" : "Sign out")}</button></li>
        </ul>
        <p>Makuwro.com v{pjson.version}</p>
      </section>
      <section id={styles.viewer}>
        {tabComp || null}
      </section>
    </main>
  ) : null;

}

Settings.propTypes = {
  client: PropTypes.object,
  setLocation: PropTypes.func,
  setCurrentUser: PropTypes.func
};