import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Settings.module.css";
import Checkbox from "../input/Checkbox";

export default function ProfileSettings({currentUser, setCurrentUser}) {

  const navigate = useNavigate();
  const [changingUsername, setChangingUsername] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);
  document.title = "Profile settings / Makuwro";

  async function changeUsername(event) {

    // Don't refresh the page, please.
    event.preventDefault();

    if (!submitting) {

      // Prevent multiple requests while we do this.
      setSubmitting(true);
      
      // Make sure the username was changed before submitting the request.
      if (newUsername && newUsername !== currentUser.username) {
        
        try {

          // Turn it into a FormData object.
          const formData = new FormData();
          formData.append("username", newUsername);

          // Send the request to change the username.
          const response = await fetch(`${process.env.RAZZLE_API_DEV}accounts/user`, {
            method: "PATCH",
            headers: {
              token: currentUser.token
            },
            body: formData
          });

          if (response.ok) {

            // Save the new username to the state.
            setCurrentUser({...currentUser, username: newUsername});

            // Disable edit mode.
            setChangingUsername(false);

            // Reset the field.
            setNewUsername("");

          } else {

            alert(await response.json().message);
            
          }

        } catch (err) {



        }

      }

      // We can submit requests again!
      setSubmitting(false);

    }

  }

  return (
    <>
      <section>
        <section>
          <h2>Avatar</h2>
          <p>This image will be shown on your profile and on all of your published content.</p>
          <img className={styles.avatar} src={`https://cdn.makuwro.com/${currentUser.avatarPath}`} />
          <button>Change avatar</button>
        </section>
        <section>
          <h2>Cover image</h2>
          <p>This image will be shown at the top of your profile.</p>
          <button>Change cover image</button>
        </section>
        <section>
          <h2>Badges</h2>
          <p>Sometimes, we give out badges to distinguish special people. You can manage these badges here.</p>
          {currentUser.isStaff && (
            <Checkbox>Show STAFF badge</Checkbox>
          )}
          <Checkbox>Show ALPHA badge</Checkbox>
          <button>Manage badges</button>
        </section>
        <section>
          <h2>Pages</h2>
          <p>You can manage pages here.</p>
        </section>
      </section>
    </>
  );

}