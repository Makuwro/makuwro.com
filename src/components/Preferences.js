import React from "react";
import Header from "./Header";
import styles from "../styles/Settings.module.css";
import LoadingScreen from "./LoadingScreen";
import Dropdown from "./Dropdown";
import SaveButton from "./SaveButton";
import PropTypes from "prop-types";

class Preferences extends React.Component {

  constructor(props) {

    super(props);
    this.updatePreferences = this.updatePreferences.bind(this);
    this.savePreferences = this.savePreferences.bind(this);
    this.preferencesElement = React.createRef();
    this.state = {
      properties: {}, 
      ready: false
    };
    
  }

  componentDidMount() {

    if (this.props.userDataObtained) {

      this.setState({
        properties: {...this.props.userCache}, 
        ready: true
      });

    }

  }

  componentDidUpdate(prevProps) {

    if (prevProps === this.props) return;
    this.setState({
      properties: {...this.props.userCache}, 
      ready: true
    });

  }

  updatePreferences(e, property) {

    const newProperties = {...this.state.properties};
    newProperties[property] = e.target.value;
    this.setState({properties: newProperties});

  }

  async savePreferences() {

    try {

      const response = await fetch(`${process.env.RAZZLE_WIKI_SERVER}/accounts/me`, {
        method: "PUT",
        headers: {
          token: this.props.token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...this.state.properties,
          _id: undefined
        })
      });
      
    } catch (err) {

      console.log(err);

    }

  }

  render() {
    
    const updatePreferences = this.updatePreferences;
    const {properties} = this.state;

    return (
      <>
        <Header {...this.props} />
        <main id={styles["settings-main"]}>
          <nav id={styles["settings-nav"]}>
            <h1>Preferences</h1>
          </nav>
          <section>
            {this.state.ready ? (
              <>
                <SaveButton onClick={this.savePreferences} />
                <section>
                  <h1>Contributing</h1>
                  <form>
                    <section>
                      <label htmlFor="contributorName">Contributor name</label>
                      <p>This is the name used for crediting you.</p>
                      <input type="text" name="contributorName" onChange={(e) => updatePreferences(e, "contributorName")} placeholder={properties.username} value={properties.contributorName} />
                    </section>
                    <section>
                      <label htmlFor="username">Username</label>
                      <p>This is the name used for logging you in.</p>
                      <input type="text" name="username" onChange={(e) => updatePreferences(e, "username")} value={properties.username} />
                    </section>
                    <section>
                      <label htmlFor="userId">User ID</label>
                      <p>This is the unique identifier given to you when you signed up. You can't change it.</p>
                      <input type="text" name="userId" value={properties._id || "Unknown"} readOnly />
                    </section>
                    <section>
                      <label htmlFor="avatar">Profile picture URL</label>
                      <p>This is the image by your name other contributors will see.</p>
                      <input type="text" name="avatar" onChange={(e) => updatePreferences(e, "avatar_url")} value={properties.avatar_url} placeholder="https://i.pinimg.com/736x/53/8c/ae/538caebb5de2705ed34c55a17f3a8615.jpg" />
                    </section>
                  </form>
                </section>
                <section>
                  <h1>Appearance</h1>
                  <form>
                    <section>
                      <label htmlFor="theme">Theme</label>
                      <Dropdown defaultOption="Night">
                        <li>Day</li>
                        <li>Night</li>
                        <li>System</li>
                      </Dropdown>
                    </section>
                  </form>
                </section>
                <section>
                  <h1>Editing</h1>
                  <form>
                    <section>
                      <input type="checkbox" name="warn-unsaved-edits" disabled />
                      <label htmlFor="warn-unsaved-edits">Warn me if I leave the editor with unsaved changes (WIP)</label>
                    </section>
                    <section>
                      <input type="checkbox" name="auto-collab" disabled />
                      <label htmlFor="auto-collab">Automatically enable collaboration mode when editing (WIP)</label>
                    </section>
                  </form>
                </section>
              </>
            ) : <LoadingScreen />}
          </section>
        </main>
      </>

    );

  }

}

Preferences.propTypes = {
  token: PropTypes.string,
  userCache: PropTypes.object,
  userDataObtained: PropTypes.bool
};

export default Preferences;