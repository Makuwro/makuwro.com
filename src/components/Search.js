import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function Search({api, authenticatedUser}) {

  const [searchParams] = useSearchParams();
  const [ready, setReady] = useState(false);
  const [results, setResults] = useState();
  const query = searchParams.get("query");
  useEffect(() => {

    if (query) {

      // Wrap around an anonymous async block in order to use await.
      (async () => {

        try {

          // Get the data from the server.
          const response = await fetch(`${api}search?name=${query}`);

          if (!response.ok) {

            throw new Error(response.statusText);
            
          }

          // Check if we got any data.
          const data = await response.json();
          console.log(data);

        } catch (err) {



        }
        
        //

        setReady(true);

      })();

    } else {

      setReady(true);

    }

  }, [query]);

  return ready ? (
    <main>
      {results ? (
        <>
          <section>
            <h1>Users</h1>
          </section>
          <section>
            <h1>Teams</h1>
          </section>
          <section>
            <h1>Teams</h1>
          </section>
          <section id="tip">
            Is there something else supposed to be here? Try searching again after <Link to="/signin">signing in</Link>!
          </section>
        </>
      ) : (query ? (
        <section>
          Searched every nook and cranny: still nothing.
        </section>
      ) : (
        <section>
          Go ahead, search something.
        </section>
      ))}
    </main>
  ) : null;

}