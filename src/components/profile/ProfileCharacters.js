import { Character } from "makuwro";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ProfileCharacters({client, owner, cache, setCache, styles, canCreate}) {

  const [ready, setReady] = useState(false);
  const [collection, setCollection] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    (async () => {

      // Check if we already have the data.
      let characterData = cache.characters;
      if (!characterData) {

        // Just in case the request throws an error, we'll be ready.
        try {
          
          // Get data from the server.
          characterData = owner.characters || await owner.getAllContent(Character);

          // Set the new cache for future reference.
          setCache({...cache, characters: characterData});

        } catch ({message}) {

          characterData = [];
          console.warn(`[Profile] Couldn't get ${owner.name || owner.displayName || owner.username}'s (${owner.id}) characters: ${message}`);

        }

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
      {canCreate && client.user?.id === owner.id && (
        <button onClick={() => navigate(`${location.pathname}?action=create-character`)}>Create character profile</button>
      )}
      {ready && (
        collection[0] ? (
          <section id={styles.characterContainer}>
            {collection}
          </section>
        ) : (
          <p>{owner.name || owner.title || owner.displayName || `@${owner.username}`} doesn't have any public character profiles :(</p>
        )
      )}
    </section>
  );

}