import React, { useEffect, useState } from "react";
import styles from "../../styles/Profile.module.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import BlogPreview from "../BlogPreview";

export default function ProfileBlog({currentUser, profileInfo, notify}) {

  const [ready, setReady] = useState(false)
  const [posts, setPosts] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const ownProfile = currentUser.username === profileInfo.username;

  async function createEmptyBlogPost(event) {

    // Please don't reload the page.
    event.preventDefault();

    if (!submitting) {

      setSubmitting(true);

      try {

        const response = await fetch(`${process.env.RAZZLE_API_DEV}contents/blog/${currentUser.username}`, {
          method: "POST",
          headers: {
            token: currentUser.token
          }
        });

        const {message, slug} = await response.json();

        if (response.ok) {

          navigate(`/${currentUser.username}/blog/${slug}?mode=edit`);

        } else {

          notify({
            title: "Couldn't create a starting post",
            children: message
          });

        }
        
      } catch ({message}) {

        notify({
          title: "Something bad happened",
          children: message
        });

      }

    }

  }

  // Get the blog posts from this user
  useEffect(() => {

    let mounted = true;

    (async () => {

      try {

        // Get all the blog posts from the server.
        const response = await fetch(`${process.env.RAZZLE_API_DEV}contents/blog/${profileInfo.username}`, {
          headers: currentUser.token ? {
            token: currentUser.token
          } : {}
        });
        const json = await response.json();
  
        if (!response.ok) {
  
          throw new Error(json.message);
  
        }
  
        if (mounted) {
  
          const posts = json;
          for (let i = 0; json.length > i; i++) {
  
            const {id, owner, title, slug} = posts[i];
  
            posts[i] = (
              <BlogPreview
                key={id}
                owner={owner}
                title={title}
                slug={slug}
                currentUserIsOwner={currentUser.id === owner.id}
              />
            );
  
          }
          setPosts(posts);
          setReady(true);
  
        }
  
      } catch (err) {
  
        alert(`Couldn't get blog posts: ${err.message}`);
  
      }

    })();

    return () => {
      
      mounted = false;

    };

  }, [profileInfo]);

  return ready ? (
    <section className={styles["profile-card"]} id={styles.blog}>
      {ownProfile && (
        <form onSubmit={createEmptyBlogPost}>
          <section>Making a blog post is a great way to keep the people interested in your work informed.</section>
          <input type="submit" value="Start drafting!" disabled={submitting} />
        </form>
      )}
      {posts || (!ownProfile ? (<p>Huh, looks like they don't have much to say right now. Check back later!</p>) : null)}
    </section>
  ) : null;

}

ProfileBlog.propTypes = {
  profileInfo: PropTypes.object,
  currentUser: PropTypes.object
};