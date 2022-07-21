import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ProfileCharacters({client, owner, cache, setCache, styles}) {

  const [ready, setReady] = useState(false);
  const [collection, setCollection] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    (async () => {

      // Check if we already have the data.
      let characterData = cache.characters;
      if (!characterData) {

        // Get the data from the server.
        characterData = await owner.getAllCharacters();

        // Save it to the cache for next time.
        setCache({...cache, characters: characterData});

      }

      // Turn the objects into components.
      const newCollection = [];
      for (let i = 0; characterData.length > i; i++) {

        const {name, owner: {username}, image, slug, id} = characterData[i];

        newCollection.push(
          <Link key={id} to={`/${username}/characters/${slug}`}>
            <section className={styles.characterAvatar}>
              <img src={`https://cdn.makuwro.com/${image || "global/pfp.png"}`} />
            </section>
            <section>
              {name}
            </section>
          </Link>
        );

      }
      setCollection(newCollection);

      setReady(true);
    })();

  }, []);

  return (
    <section>
      {client.user?.id === owner.id && (
        <button onClick={() => navigate(`${location.pathname}?action=create-character`)}>Create character profile</button>
      )}
      {ready && (
        collection[0] ? (
          <section id={styles.characterContainer}>
            {collection}
          </section>
        ) : (
          <p>{owner.displayName} doesn't have any public character profiles :(</p>
        )
      )}
    </section>
  );

}