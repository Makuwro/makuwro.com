import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProfileArt({client, owner, cache, setCache, styles}) {

  const [ready, setReady] = useState(false);
  const [collection, setCollection] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    // Check if we already have the data.
    if (!cache.art) {

      // Get data from the server.

      // Save the data to the cache.
      const data = [];
      const newCollection = [];
      for (let i = 0; data.length > i; i++) {

        const {slug, imagePath} = data[i];

        newCollection.push(
          <Link to={slug}>
            <img src={`https://cdn.makuwro.com/${imagePath}`} />
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
        <button onClick={() => navigate(`/${owner.username}/art?action=upload-art`)}>Upload art</button>
      )}
      {collection[0] ? (
        <section id={styles.artContainer}>
          {collection}
        </section>
      ) : (
        <p>{owner.displayName} doesn't have any public art :(</p>
      )}
    </section>
  )

}