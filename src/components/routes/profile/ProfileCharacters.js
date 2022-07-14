import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProfileCharacters({client, owner, cache, setCache, styles}) {

  const [ready, setReady] = useState(false);
  const [collection, setCollection] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    // Check if we already have the art data.
    if (!cache.characters) {

      // Get art data from the server.

      // Save the data to the cache.
      const characterData = [{
        name: "Sudobeast",
        slug: "",
        image: "",
        owner: {
          username: "Christian"
        }
      },{
        name: "Sudobeast",
        slug: "",
        image: "",
        owner: {
          username: "Christian"
        }
      },{
        name: "Sudobeast",
        slug: "",
        image: "",
        owner: {
          username: "Christian"
        }
      },]
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
        <button>Create character profile</button>
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