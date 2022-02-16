import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "../styles/Blog.module.css";
import Footer from "./Footer";

export default function BlogPost({currentUser, addNotification}) {

  const {username, slug} = useParams();
  const [editing, setEditing] = useState(false);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(true);
  const [post, setPost] = useState({});
  const [content, setContent] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    if (post.content) {

      const matches = [...post.content.matchAll(/\n?(.+)/gm)];
      const content = [];
      for (let i = 0; matches.length > i; i++) {

        content.push(<p key={i}>{matches[i][1]}</p>);

      }

      setContent(content);

    }

  }, [post]);

  useEffect(() => {

    if (ready) {

      setTimeout(() => setLeaving(false), 0);

    }

    return () => {

      if (!leaving) {

        setLeaving(true);

      }

    };

  }, [ready, location]);

  useEffect(async () => {

    // Try to get the blog post
    if (!editing) {

      try {

        const response = await fetch(`${process.env.RAZZLE_API_DEV}contents/blog/${username}/${slug}`, {
          headers: {
            token: currentUser.token
          }
        });

        if (response.ok) {

          setPost(await response.json());

        } else {

          console.log(await response.json());
          setPost({});

        }

      } catch (err) {

        
        console.log(err);

      }
      setReady(true);

    }

  }, [username, slug, editing]);

  async function deletePost() {

    if (confirm("Are you sure you want to delete this post? If someone reported it, it'll only be hidden until the Makuwro Safety & Security team reviews it.")) {

      try {

        const response = await fetch(`${process.env.RAZZLE_API_DEV}contents/blog/${username}/${slug}`, {
          headers: {
            token: currentUser.token
          },
          method: "DELETE"
        });

        if (response.ok) {

          navigate(`/${username}/blog`);

        } else {

          const {message} = await response.json();
          throw new Error(message);

        }

      } catch ({message}) {

        addNotification({
          title: "Couldn't delete your post",
          children: message
        });

      }

    }

  }

  return ready && (
    <main id={styles.post} className={leaving ? "leaving" : ""}>
      {post.id ? (
        <>
          <section id={styles.metadata}>
            <section id={styles.cover}>
              <img src="https://d1e00ek4ebabms.cloudfront.net/production/ad60a0ef-f43b-4a8c-9279-a3f118c98911.png" />
            </section>
            <section id={styles.postInfo}>
              <h1>Why you're wrong</h1>
              <p>This is serious, so you should take this seriously.</p>
              <Link to={""} id={styles.creator}>
                <img src="https://media.discordapp.net/attachments/539176248673566760/942512442427203624/kyew18norlh81.png?width=583&height=583" />
                <span>Christian Toney</span>
              </Link>
              <section id={styles.actions}>
                <button>Edit</button>
                <button className="destructive" onClick={deletePost}>Delete</button>
              </section>
            </section>
          </section>
          <section id={styles.content} contentEditable={editing}>
            {content}
          </section>
        </>
      ) : "That one doesn't exist!"}
      <Footer />
    </main>
  );

}