import { Art } from "makuwro";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProfileArt({client, owner, cache, setCache, styles, canCreate}) {

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
          cache.art = owner.art || await owner.getAllContent(Art);

        } catch ({message}) {

          console.warn(`[Profile] Couldn't get ${owner.name || owner.displayName || owner.username}'s (${owner.id}) art: ${message}`);

        }

        // Set the new cache for future reference.
        setCache(cache);

      }

      const newCollection = [];
      for (let i = 0; (cache.art?.length || 0) > i; i++) {

        const {slug, owner, id} = cache.art[i];

        newCollection.push(
          <Link to={`/${owner.username}/art/${slug}`} key={slug}>
            <img src={`https://cdn.makuwro.com/${owner.id}/art/${id}`} />
          </Link>
        );

      }
      setCollection(newCollection);
      setReady(true);

    })();

  }, []);

  return (
    <section>
      {canCreate && isOwner && (
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
                <p>{(owner.title || owner.name || owner.displayName || `@${owner.username}`)} doesn't have any {!isOwner ? "public" : ""} art :(</p>
                {
                  (!canCreate) && isOwner && (
                    <section className="info">
                      To put art here, upload them from your profile!
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