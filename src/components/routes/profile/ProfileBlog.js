import React, { useEffect, useState } from "react";
import styles from "../../../styles/Profile.module.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import BlogPreview from "./BlogPreview";

export default function ProfileBlog({client, owner}) {

  const [ready, setReady] = useState(false);
  const [posts, setPosts] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const ownProfile = client.user?.username === owner.username;

  async function createEmptyBlogPost(event) {

    // Please don't reload the page.
    event.preventDefault();

    if (!submitting) {

      setSubmitting(true);

      try {

        const {slug} = await client.createBlogPost();
        navigate(`/${client.user.username}/blog/${slug}?mode=edit`);
        
      } catch ({message}) {

        alert(message);
        setSubmitting(false);

      }

    }

  }

  // Get the blog posts from this user
  useEffect(() => {

    let mounted = true;

    (async () => {

      try {

        // Get all the blog posts from the server.
        const posts = await client.getAllBlogPosts(owner.username);

        for (let i = 0; posts.length > i; i++) {

          const {id, owner, title, slug} = posts[i];

          posts[i] = (
            <BlogPreview
              key={id}
              owner={owner}
              title={title}
              slug={slug}
              currentUserIsOwner={client.user?.id === owner.id}
            />
          );

        }

        if (mounted) {
          
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

  }, [owner]);

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
  owner: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired
};