import { Story } from "makuwro";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function ProfileStories({client, owner, cache, setCache, styles, profileType}) {

  const [ready, setReady] = useState(false);
  const [collection, setCollection] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const isCharacter = profileType === "character";
  const isOwner = client.user?.id === (owner?.owner || owner).id;

  useEffect(() => {

    (async () => {

      // Check if we already have the data.
      let storyData = cache.stories;
      if (!storyData) {

        try {

          // Get the data from the server.
          storyData = await owner.getAllContent(Story);

          // Save it to the cache for next time.
          setCache({...cache, stories: storyData});

        } catch (err) {

          console.error(err);

        }

      }

      // Save the data to the cache.
      const data = storyData || [];
      const newCollection = [];
      for (let i = 0; data.length > i; i++) {

        const {name, owner: {username}, image, slug} = data[i];

        newCollection.push(
          <Link key={slug} to={`/${username}/stories/${slug}`}>
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

    })()

  }, []);

  return (
    <section>
      {client.user?.id === owner.id && (
        <button onClick={() => navigate(`${location.pathname}?action=create-story`)}>Create story</button>
      )}
      {
        ready && (
          <>
            {collection[0] ? (
              <section id={styles.storyContainer}>
                {collection}
              </section>
            ) : (
              <p>{owner.name || owner.displayName || `@${owner.username}`} doesn't have any public stories :(</p>
            )}
            {
              isCharacter && isOwner && (
                <section className="info">To attach stories to this character, upload them from your profile!</section>
              )
            }
          </>
        )
      }
    </section>
  )

}