import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProfileOrganizations({client, owner, cache, setCache, styles}) {

  const [ready, setReady] = useState(false);
  const [collection, setCollection] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    // Check if we already have the data.
    if (!cache.organizations) {

      // Save the data to the cache.
      const data = [{
        name: "Beastslash",
        username: "Beastslash",
        image: ""
      }, {
        name: "Makuwro",
        username: "Makuwro",
        image: ""
      }]
      const newCollection = [];
      for (let i = 0; characterData.length > i; i++) {

        const {name, image, username} = data[i];

        newCollection.push(
          <Link to={`/${username}`}>
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

    }

    setReady(true);

  }, []);

  return (
    <section>
      {client.user?.id === owner.id && (
        <button>Create organization</button>
      )}
      {collection[0] ? (
        <section id={styles.organizationContainer}>
          {collection}
        </section>
      ) : (
        <p>{owner.displayName} doesn't have any public memberships :(</p>
      )}
    </section>
  )

}