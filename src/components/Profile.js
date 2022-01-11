import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Profile.module.css";
import Footer from "./Footer";
import ProfileLibraryArt from "./profile/ProfileLibraryItem";

class Profile extends React.Component {

  render() {

    document.title = "Christian Toney / Makuwro";

    return (
      <main id={styles["profile-main"]}>
        <section id={styles["profile-bg"]}>
          <button id={styles["profile-btn-edit"]}>Edit profile</button>
          <section id={styles["profile-info"]}>
            <img src="https://i1.sndcdn.com/avatars-cQrv7oKRIfqHb95q-i9wmwQ-t200x200.jpg" />
            <section>
              <h1>Christian Toney</h1>
              <h2>@Sudobeast</h2>
            </section>
          </section>
        </section>
        <section id={styles["profile-container"]}>
          <section id={styles["profile-container-left"]}>
            <section className={styles["profile-card"]} id={styles["profile-bio"]}>
              <h1>About</h1>
              <p>I'm extra epic</p>
            </section>
          </section>
          <section id={styles["profile-container-center"]}>
            <section className={styles["profile-card"]} id={styles["profile-selection"]}>
              <Link to="#activity">Activity</Link>
              <Link to="#art">Art</Link>
              <Link to="#blog">Blog</Link>
              <Link to="#characters">Characters</Link>
              <Link to="#stats">Stats</Link>
              <Link to="#stories">Stories</Link>
              <Link to="#teams">Teams</Link>
              <Link to="#">Worlds</Link>
            </section>
            
            <ProfileLibraryArt />

          </section>
          <section id={styles["profile-container-right"]}>
            <section className={styles["profile-card"]} id={styles["profile-actions"]}>
              <button>Follow</button>
              <button>Message</button>
              <button className="destructive">Block</button>
              <button className="destructive">Report</button>
            </section>
          </section>
        </section>

        <Footer />
      </main>
    );

  }

}

export default Profile;