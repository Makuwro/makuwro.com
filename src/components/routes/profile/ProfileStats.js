import React, { useEffect, useState } from "react";
import styles from "../../../styles/Profile.module.css";
import PropTypes from "prop-types";


export default function ProfileStats({client, owner, isCharacter}) {

  let date = new Date(owner.lastOnline);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let dateString = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  const [ready, setReady] = useState();

  useEffect(() => {

    setReady(true);

  }, []);

  return ready ? (
    <section className={styles["profile-card"]} id={styles["profile-stats"]}>
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
            {owner.followingList && (
              <>
                <section>
                  <section>Following</section>
                  <section>{owner.followingList.length}</section>
                </section>
                <section>
                  <section>Followers</section>
                  <section>0</section>
                </section>
              </>
            )}
          </>
        )}
        <section>
          <section>{isCharacter ? "Character" : "User"} ID</section>
          <section>{owner.id}</section>
        </section>
      </>
    </section>
  ) : null;

}

ProfileStats.propTypes = {
  owner: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  isCharacter: PropTypes.bool
};