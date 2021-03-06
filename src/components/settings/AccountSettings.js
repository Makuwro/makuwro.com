import React, { useState } from "react";
import styles from "../../styles/Settings.module.css";
import SettingsDropdown from "./SettingsDropdown";
import PropTypes from "prop-types";
import Checkbox from "../input/Checkbox";

export default function AccountSettings({client, menu, setMenu, submitting, updateAccount}) {

  const {user} = client;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  
  function resetFields() {

    setDisplayName("");
    setEmail("");
    setUsername("");
    setNewPassword("");
    setPassword("");
    setPasswordAgain("");

  }

  async function disableAccount(event) {

    event.preventDefault();

    if (!submitting && confirm("Are you sure you want to disable your account? You can come back at any time.")) {

      // Send a request to disable the account
      await client.user.disable(password);

      // Delete the token cookie.
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Tell the user.
      alert("Your account has been disabled and you have been signed out. You may come back whenever you would like by signing back in. We hope you enjoy your break!");

      // Redirect to the home page.
      location = "/";

    }

  }

  async function deleteAccount(event) {

    event.preventDefault();
    
    if (!submitting && confirm("Woahh there, buddy. Are you sure you want to delete your account? You will have 24 hours to change your mind by signing in before everything goes POOF!")) {

      // Send a request to delete the account.
      await client.user.delete(password);

      // Delete the token cookie.
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Tell the user.
      alert("You have been signed out and your account has been marked for deletion. Additionally, all of your uploaded content is now private. If you did this by mistake, sign back in immediately! If you didn't, we hope you had a great time at Makuwro, and hope you give it another spin one of these days.")

      // Redirect to the home page.
      location = "/";

    }

  }

  async function updateAccountWrapper(event, key, value) {

    return await updateAccount(event, key, value, resetFields, password, passwordAgain);

  }

  function toggleMenu(index) {

    resetFields();
    if (index === menu) {

      setMenu();

    } else {

      setMenu(index);

    }

  }

  document.title = "Account settings / Makuwro";

  return (
    <>
      <section id={styles.welcome}>
        <img className="avatar-preview" src={`https://cdn.makuwro.com/${user.id}/avatar`} />
        <h1>Hi, {user.displayName || user.username}!</h1>
        <p>You can manage your account information here.</p>
      </section>
      <section id={styles.options}>
        <SettingsDropdown 
          title="Display name" 
          description="This is your preferred name when using Makuwro. We'll show this before your username." 
          open={menu === 0} 
          onClick={() => toggleMenu(0)}
        >
          {user.displayName && (
            <p>Your current display name is <b>{user.displayName}</b>.</p>
          )}
          <form onSubmit={(event) => updateAccountWrapper(event, "displayName", displayName)}>
            <label>New display name</label>
            <input type="text" value={displayName} onInput={(event) => setDisplayName(event.target.value)} />
            <input type="submit" value="Save" disabled={submitting} />
          </form>
        </SettingsDropdown>
        <SettingsDropdown
          title="Username"
          description="This unique name is used for signing in and for other members to identify you."
          open={menu === 1}
          onClick={() => toggleMenu(1)}
        >
          <p>Your current username is <b>{user.username}</b>.</p>
          <p>If you change your username, anyone will be able to claim your previous username. Due to this, we will not redirect your creations from your previous username to your new username in order to free the slugs for the new username owner.</p>
          <form onSubmit={(event) => updateAccountWrapper(event, "username", username)}>
            <label>New username</label>
            <input type="text" value={username} onInput={(event) => setUsername(event.target.value)} required />
            <label>Password</label>
            <input type="password" value={password} onInput={(event) => setPassword(event.target.value)} required />
            <input type="submit" value="Save" disabled={submitting} />
          </form>
        </SettingsDropdown>
        <SettingsDropdown
          title="Password"
          description="This, along with your username, is used for signing you in."
          open={menu === 3}
          onClick={() => toggleMenu(3)}
        >
          <form onSubmit={(event) => updateAccountWrapper(event, "newPassword", newPassword)}>
            <label>Current password</label>
            <input type="password" required value={password} onInput={(event) => setPassword(event.target.value)}  />
            <label>New password</label>
            <input type="password" required value={newPassword} onInput={(event) => setNewPassword(event.target.value)} />
            <label>Confirm new password</label>
            <input type="password" required value={passwordAgain} onInput={(event) => setPasswordAgain(event.target.value)}  />
            <Checkbox>
              Sign out everywhere else
            </Checkbox>
            <input type="submit" value="Save" disabled={submitting} />
          </form>
        </SettingsDropdown>
        <SettingsDropdown 
          title="Email address"
          description="This email address is only used for authenticating you. If you forgot your password, you can use this email to reset it."
          open={menu === 4} 
          onClick={() => toggleMenu(4)}
        >
          <form onSubmit={(event) => updateAccountWrapper(event, "email", email)}>
            <label>New email address</label>
            <input type="email" value={email} onInput={(event) => setEmail(event.target.value)} required />
            <label>Password</label>
            <input type="password" value={password} onInput={(event) => setPassword(event.target.value)} required />
            <input type="submit" value="Save" disabled={submitting} />
          </form>
        </SettingsDropdown>
        <SettingsDropdown
          title="Disable your account"
          description="If you want to take a break, you can disable your account."
          open={menu === 5} 
          onClick={() => toggleMenu(5)}
        >
          <p>Your profile and content will become private and you'll be signed out everywhere.</p>
          <p>We will email you every six months to protect your username from the inactive account policy.</p>
          <p>You can re-enable your account by signing back in.</p>
          <form onSubmit={disableAccount}>
            <label>Password</label>
            <input type="password" value={password} onInput={(event) => setPassword(event.target.value)} />
            <input type="submit" className="destructive" value="Disable account" />
          </form>
        </SettingsDropdown>
        <SettingsDropdown 
          title="Delete your account"
          open={menu === 6} 
          onClick={() => toggleMenu(6)}
        >
          {client.user.isStaff ? (
            <section className="info">This account is currently protected by Makuwro, LLC. It cannot be deleted on Makuwro.com.</section>
          ) : (
            <>
              <section className="info">You currently own teams! You must transfer or delete them of them before deleting your account.</section>
              <p>If you want to permanently delete your account and all content you uploaded, you may request to do so by pressing the button below.</p>
              <p>You will have 24 hours to cancel your request by signing back in, but after the time passes, all information you gave us will be deleted and irrecoverable. It will not be anonymized; it will be <b>gone</b>. Makuwro staff members will not be able to recover your account after this. Additionally, your username will be re-released into the pool of available usernames.</p>
              <form onSubmit={deleteAccount}>
                <label>Password</label>
                <input type="password" value={password} onInput={(event) => setPassword(event.target.value)} />
                <input type="submit" className="destructive" value="Delete account" />
              </form>
            </>
          )}
        </SettingsDropdown>
      </section>
    </>
  );

}

AccountSettings.propTypes = {
  client: PropTypes.object
};