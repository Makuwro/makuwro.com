import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProfileArt({client, owner, cache, setCache, styles, isCharacter, isStory}) {

  const [ready, setReady] = useState(false);
  const [collection, setCollection] = useState([]);
  const navigate = useNavigate();
  const isOwner = client.user?.id === (owner?.owner || owner).id;

  useEffect(() => {

    (async () => {

      // Check if we already have the data.
      if (!cache.art) {

        // Just in case the request throws an error, we'll be ready.
        try {
          
          // Get data from the server.
          cache.art = owner.art || await owner.getAllArt();

        } catch ({message}) {

          console.warn(`[Profile] Couldn't get ${owner.name || owner.displayName || owner.username}'s (${owner.id}) art: ${message}`);

        }

        // Set the new cache for future reference.
        setCache(cache);

      }

      const newCollection = [];
      for (let i = 0; (cache.art?.length || 0) > i; i++) {

        const {slug, owner, imagePath} = cache.art[i];

        newCollection.push(
          <Link to={`/${owner.username}/art/${slug}`} key={slug}>
            <img src={`https://cdn.makuwro.com/${imagePath}`} />
          </Link>
        );

      }
      setCollection(newCollection);
      setReady(true);

    })();

  }, []);

  return (
    <section>
      {!isCharacter && !isStory && isOwner && (
        <button onClick={() => navigate(`/${owner.username}/art?action=upload-art`)}>Upload art</button>
      )}
      {
        ready ? (
          <>
            {collection[0] ? (
              <section id={styles.artContainer}>
                {collection}
              </section>
            ) : (
              <>
                <p>{(owner.title || owner.name || owner.displayName || `@${owner.username}`)} doesn't have any public art :(</p>
                {
                  (isStory || isCharacter) && isOwner && (
                    <section className="info">
                      To attach art to this {isStory ? "story" : "character"}, upload them from your {isStory ? "chapters" : "profile"}!
                    </section>
                  )
                }
              </>
            )}
          </>
        ) : null
      }
    </section>
  );

}