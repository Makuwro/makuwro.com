import React, { useEffect, useState } from "react";
import styles from "../../styles/Profile.module.css";
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function ProfileStats({profileInfo, isCharacter}) {

  let date = new Date(profileInfo.lastOnline);
  let dateString = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  const [ready, setReady] = useState();

  useEffect(() => {

    if (profileInfo) {

      setReady(true);
      
    }

  }, [profileInfo]);

  return (
    <section className={styles["profile-card"]} id={styles["profile-stats"]}>
      {ready ? (
        <>
          {isCharacter ? (
            <>
              <section>
                <section>Likes</section>
                <section>0</section>
              </section>
            </>
          ) : (
            <>
              <section>
                <section>Joined on</section>
                <section>January 11, 2022</section>
              </section>
              <section>
                <section>Last seen</section>
                <section>{dateString}</section>
              </section>
              {profileInfo.followingList && (
                <>
                  <section>
                    <section>Following</section>
                    <section>{profileInfo.followingList.length}</section>
                  </section>
                  <section>
                    <section>Followers</section>
                    <section>0</section>
                  </section>
                </>
              )}
              <section>
                <section>Art uploaded</section>
                <section>0</section>
              </section>
              <section>
                <section>Characters created</section>
                <section>0</section>
              </section>
              <section>
                <section>Characters owned</section>
                <section>0</section>
              </section>
              <section>
                <section>Literature created</section>
                <section>0</section>
              </section>
            </>
          )}
          <section>
            <section>{isCharacter ? "Character" : "User"} ID</section>
            <section>{profileInfo.id}</section>
          </section>
        </>
      ) : (
        <section>loading</section>
      )}
    </section>
  );

}