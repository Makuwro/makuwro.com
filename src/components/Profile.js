import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Profile.module.css";
import Footer from "./Footer";
import ProfileLibraryItem from "./profile/ProfileLibraryItem";
import ProfileStats from "./profile/ProfileStats";
import PropTypes from "prop-types";

class Profile extends React.Component {

  constructor(props) {

    console.log(props);

    super();
    this.state = {
      tab: props.tab || "activity",
      displayName: props.username,
      username: props.username,
      disabled: false
    };

  }

  componentDidUpdate(oldProps) {

    if (oldProps.tab !== this.props.tab) this.setState({tab: this.props.tab});

  }

  render() {

    const components = {
      art: <ProfileLibraryItem tab="art" />,
      literature: <ProfileLibraryItem tab="literature" />,
      worlds: <ProfileLibraryItem tab="worlds" />,
      teams: <ProfileLibraryItem tab="teams" />,
      stats: <ProfileStats />
    };
    let tab;

    document.title = `${this.state.displayName} / Makuwro`;

    tab = components[this.state.tab];

    return (
      <main id={styles["profile"]}>
        <section id={styles["profile-bg"]}>
          <button id={styles["profile-btn-edit"]}>Edit profile</button>
          <section id={styles["profile-info"]}>
            <img src="https://i1.sndcdn.com/avatars-cQrv7oKRIfqHb95q-i9wmwQ-t200x200.jpg" />
            <section>
              <h1>{this.state.displayName}<span title="This user is a Makuwro staff member" className={styles["profile-badge"]}>STAFF</span></h1>
              <h2>{`@${this.state.username}`}</h2>
              {this.state.disabled && (
                <p>This account has been disabled for violating the <a href="https://about.makuwro.com/policies/terms">terms of service</a></p>
              )}
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
              <Link to={`/${this.state.username}`}>Activity</Link>
              <Link to={`/${this.state.username}/art`}>Art</Link>
              <Link to={`/${this.state.username}/blog`}>Blog</Link>
              <Link to={`/${this.state.username}/characters`}>Characters</Link>
              <Link to={`/${this.state.username}/literature`}>Literature</Link>
              <Link to={`/${this.state.username}/stats`}>Stats</Link>
              <Link to={`/${this.state.username}/teams`}>Teams</Link>
              <Link to={`/${this.state.username}/terms`}>Terms</Link>
              <Link to={`/${this.state.username}/worlds`}>Worlds</Link>
            </section>
            <>{tab}</>
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

Profile.propTypes = {
  username: PropTypes.string,
  tab: PropTypes.string
};

export default Profile;