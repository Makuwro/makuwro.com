import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ProfileCharacters({client, owner, cache, setCache, styles}) {

  const [ready, setReady] = useState(false);
  const [collection, setCollection] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    // Check if we already have the data.
    if (!cache.characters) {

      // Get art data from the server.

      // Save the data to the cache.
      const characterData = [];
      const newCollection = [];
      for (let i = 0; characterData.length > i; i++) {

        const {name, owner: {username}, image, slug} = characterData[i];

        newCollection.push(
          <Link to={`/${username}/characters/${slug}`}>
            <section className={styles.characterAvatar}>
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
        <button onClick={() => navigate(`${location.pathname}?action=create-character`)}>Create character profile</button>
      )}
      {collection[0] ? (
        <section id={styles.characterContainer}>
          {collection}
        </section>
      ) : (
        <p>{owner.displayName} doesn't have any public character profiles :(</p>
      )}
    </section>
  )

}