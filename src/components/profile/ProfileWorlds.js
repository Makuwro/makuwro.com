import { World } from "makuwro";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function ProfileWorlds({client, owner, cache, setCache, styles, isCharacter, isStory}) {

  const [ready, setReady] = useState(false);
  const [collection, setCollection] = useState([]);
  const isOwner = client.user?.id === (owner?.owner || owner).id;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    (async () => {

      // Check if we already have the data.
      let data = cache.worlds;
      if (!data) {

        try {

          // Save the data to the cache.
          data = await owner.getAllContent(World) || [];
          setCache({...cache, worlds: data});

        } catch (err) {

          data = [];
          console.error(err);

        }

      }

      const newCollection = [];
      for (let i = 0; data.length > i; i++) {

        const {name, owner: {username}, image, slug} = data[i];

        newCollection.push(
          <Link to={`/${username}/worlds/${slug}`}>
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
      setReady(true);

    })();

  }, []);

  return (
    <section>
      {client.user?.id === owner.id && (
        <button onClick={() => navigate(`${location.pathname}?action=create-world`)}>Create world</button>
      )}
      {
        ready && (
          <>
            {
              collection[0] ? (
                <section id={styles.organizationContainer}>
                  {collection}
                </section>
              ) : (
                <p>{owner.title || owner.name || owner.displayName || `@${owner.username}`} doesn't have any public worlds :(</p>
              )
            }
            {
              (isStory || isCharacter) && isOwner && (
                <section className="info">
                  To attach worlds to this {isStory ? "story" : "character"}, {isStory ? "add" : "upload"} them from your {isStory ? "world" : "profile"}!
                </section>
              )
            }
          </>
        )
      }
    </section>
  )

}