import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProfileStories({client, owner, cache, setCache, styles}) {

  const [ready, setReady] = useState(false);
  const [collection, setCollection] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    // Check if we already have the data.
    if (!cache.stories) {

      // Save the data to the cache.
      const data = []
      const newCollection = [];
      for (let i = 0; data.length > i; i++) {

        const {name, owner: {username}, image, slug} = data[i];

        newCollection.push(
          <Link to={`/${username}/stories/${slug}`}>
            <section className={styles.orgAvatar}>
              <img src={image} />
            </section>
            <section>
              {name}
            </section>
          </Link>
        );

      }
      setCollection(newCollection);

    }

    setReady(true);

  }, []);

  return (
    <section>
      {client.user?.id === owner.id && (
        <button>Create story</button>
      )}
      {collection[0] ? (
        <section id={styles.storyContainer}>
          {collection}
        </section>
      ) : (
        <p>{owner.displayName} doesn't have any public stories :(</p>
      )}
    </section>
  )

}