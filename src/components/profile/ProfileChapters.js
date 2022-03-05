import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProfileChapters({profileInfo, currentUser}) {

  const [chapterComps, setChapterComps] = useState();
  const [ready, setReady] = useState();
  const [busy, setBusy] = useState(false);

  useEffect(async () => {

    const chapterComps = [];

    if (chapterComps[0]) {

      setChapterComps(<ul>{chapterComps}</ul>);

    } else {

      setChapterComps();

    }

    setReady(true);

  }, [profileInfo, currentUser]);

  async function createNewChapter() {

    if (!busy) {

      setBusy(true);

    }

  }

  return ready ? (
    <section>
      <section>
        {profileInfo.owner.id === currentUser?.id && (
          <section>
            How about writing a new chapter? <button onClick={createNewChapter} disabled={busy}>Let's do this!</button>
          </section>
        )}
        {chapterComps || (
          <section>
            Looks like this literature doesn't have any chapters yet. Check back later!
          </section>
        )}
      </section>
      <section>
        
      </section>
    </section>
  ) : null;

}