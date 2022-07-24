import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ProfileMembers({client, owner, styles, canCreate}) {

  const [ready, setReady] = useState(false);
  const [collection, setCollection] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    // Check if we already have the data.
    let memberData = owner.members || [];

    // Turn the objects into components.
    const newCollection = [];
    for (let i = 0; memberData.length > i; i++) {

      const {name, username, id} = memberData[i];

      newCollection.push(
        <Link key={id} to={`/${username}`}>
          <section className={styles.characterAvatar}>
            <img src={`https://cdn.makuwro.com/${id}/avatar`} />
          </section>
          <section>
            {name}
          </section>
        </Link>
      );

    }

    setCollection(newCollection);
    setReady(true);

  }, []);

  return (
    <section>
      {canCreate && client.user?.id === owner.id && (
        <button onClick={() => navigate(`${location.pathname}/settings/members`)}>Manage members</button>
      )}
      {ready && (
        collection[0] ? (
          <section id={styles.characterContainer}>
            {collection}
          </section>
        ) : (
          <p>{owner.name} doesn't have any public members :(</p>
        )
      )}
    </section>
  );

}