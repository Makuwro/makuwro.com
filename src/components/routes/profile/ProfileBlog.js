import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProfileBlog({client, owner, cache, setCache, styles}) {

  const [ready, setReady] = useState(false);
  const [collection, setCollection] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    // Check if we already have the data.
    if (!cache.art) {

      // Get data from the server.

      // Save the data to the cache.
      const blogData = [{
        title: "Welcome to Makuwro!",
        tagline: "Let's learn how to use Makuwro!",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/ISS059-E-48038_-_View_of_Earth.jpg/800px-ISS059-E-48038_-_View_of_Earth.jpg?20210422111437",
        topic: "How to use Makuwro"
      }, {
        title: "Test without image",
        tagline: "Testing testing 123!"
      }];
      const newCollection = [];
      for (let i = 0; blogData.length > i; i++) {

        const {title, tagline, image, topic} = blogData[i];

        newCollection.push(
          <Link to="#">
            {image && (
              <section className={styles.blogBanner}>
                <img src={image} />
              </section>
            )}
            <section>
              {topic && (
                <section className={styles.topic}>{topic}</section>
              )}
              <h1>{title}</h1>
              <p>{tagline}</p>
            </section>
          </Link>
        );

      }
      setCollection(newCollection);

    }

    setReady(true);

  }, []);

  function createEmptyBlogPost() {

  }

  return (
    <section>
      {client.user?.id === owner.id && (
        <button onClick={createEmptyBlogPost}>Create blog post</button>
      )}
      {collection[0] ? (
        <section id={styles.blogContainer}>
          {collection}
        </section>
      ) : (
        <p>{owner.displayName} doesn't have any public art :(</p>
      )}
    </section>
  )

}