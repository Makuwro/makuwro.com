import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ProfileCharacters({client, owner, cache, setCache, styles, isStory}) {

  const [ready, setReady] = useState(false);
  const [collection, setCollection] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const isOwner = client.user?.id === (owner?.owner || owner).id;

  useEffect(() => {

    (async () => {

      // Check if we already have the data.
      let characterData = isStory ? (owner.characters || []) : cache.characters;
      if (!isStory && !characterData) {

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
      {!isStory && client.user?.id === owner.id && (
        <button onClick={() => navigate(`${location.pathname}?action=create-character`)}>Create character profile</button>
      )}
      {ready && (
        collection[0] ? (
          <section id={styles.characterContainer}>
            {collection}
          </section>
        ) : (
          <>
            <p>{owner.title || owner.displayName || `@${owner.username}`} doesn't have any public character profiles :(</p>
            {
              isStory && isOwner && (
                <section className="info">
                  To attach characters to this story, upload them from your chapters!
                </section>
              )
            }
          </>
        )
      )}
    </section>
  );

}