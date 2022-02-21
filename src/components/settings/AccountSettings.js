import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Settings.module.css";

export default function AccountSettings({currentUser, setCurrentUser}) {

  const navigate = useNavigate();
  const [changingUsername, setChangingUsername] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);
  document.title = "Account settings / Makuwro";

  async function disableAccount() {

    if (confirm("Are you sure you want to disable your account? You can come back at any time.")) {

      // Send a request to disable the account

      // Delete the token cookie
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Redirect to the home page
      navigate("/");

    }

  }

  async function deleteAccount() {

    if (confirm("Woahh there, buddy. Are you sure you want to delete your account? You will have 24 hours to change your mind by signing in before everything goes POOF!")) {

      

    }

  }

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
      <section id={styles.welcome}>
        <img className={styles.avatar} src={`https://cdn.makuwro.com/${currentUser.avatarPath}`} />
        <h1>Hi, {currentUser.displayName || currentUser.username}!</h1>
        <p>You can manage your account information here.</p>
      </section>
      <section>
        <section>
          <h2>Display name</h2>
          <p>This is your preferred name when using Makuwro. We'll show this before your username.</p>
          {changingUsername ? (
            <form onSubmit={changeUsername}>
              <label>New username</label>
              <input type="text" placeholder={currentUser.displayName} value={newUsername} onInput={(event) => setNewUsername(event.target.value)} />
              <input type="submit" value="Save" disabled={submitting} />
            </form>
          ) : (
            <>
              {currentUser.displayName && (
                <p>Your current display name is <b>{currentUser.displayName}</b></p>
              )}
              <button onClick={() => setChangingUsername(true)}>Change display name</button>
            </>
          )}
        </section>
        <section>
          <h2>Username</h2>
          <p>This unique name is used for signing in and for other members to identify you.</p>
          {changingUsername ? (
            <form onSubmit={changeUsername}>
              <label>New username</label>
              <input type="text" placeholder={currentUser.username} value={newUsername} onInput={(event) => setNewUsername(event.target.value)} />
              <input type="submit" value="Save" disabled={submitting} />
            </form>
          ) : (
            <>
              <p>Your current username is <b>{currentUser.username}</b>.</p>
              <button onClick={() => setChangingUsername(true)}>Change username</button>
            </>
          )}
        </section>
        <section>
          <h2>Password</h2>
          <p>This, along with your username, is used for signing you in.</p>
          {changingPassword ? (
            <form>
              <label>Current password</label>
              <input type="password" required />
              <label>New password</label>
              <input type="password" required />
              <label>Confirm new password</label>
              <input type="password" required />
              <input type="submit" value="Save" disabled={submitting} />
            </form>
          ) : <button onClick={() => setChangingPassword(true)}>Change password</button>}
        </section>
        <section>
          <h2>Email address</h2>
          <p>This email address is only used for authenticating you. If you forgot your password, you can use this email to reset it.</p>
          {changingEmail ? (
            <form>
              <label>Email address</label>
              <input type="email" required />
              <label>Password</label>
              <input type="password" required />
              <input type="submit" value="Save" disabled={submitting} />
            </form>
          ) : <button onClick={() => setChangingEmail(true)}>Change email address</button>}
        </section>
      </section>
      <section>
        <section>
          <h2>Disable your account</h2>
          <p>If you want to take a break, you can disable your account.</p>
          <p>Your profile and content will become private and you'll be logged out everywhere.</p>
          <p>You can re-enable your account by signing back in.</p>
          <button className="destructive" onClick={disableAccount}>Disable account</button>
        </section>
        <section>
          <h2>Delete your account</h2>
          <p>If you want to permanently delete your account and all content you uploaded, you may request to do so by pressing the button below.</p>
          <p>You will have 24 hours to cancel your request by signing back in, but after the time passes, all information you gave us will be deleted.</p>
          <button className="destructive" onClick={deleteAccount}>Delete account</button>
        </section>
      </section>
    </>
  );

}