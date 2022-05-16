import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Settings.module.css";
import SettingsDropdown from "./SettingsDropdown";

export default function AccountSettings({client, menu, setMenu, submitting, updateAccount}) {

  const {user} = client;
  const navigate = useNavigate();
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
      if (await updateAccountWrapper(event, "isDisabled", true)) {

        // Delete the token cookie
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Redirect to the home page
        navigate("/");

      }

    }

  }

  async function deleteAccount(event) {

    event.preventDefault();
    
    if (!submitting && confirm("Woahh there, buddy. Are you sure you want to delete your account? You will have 24 hours to change your mind by signing in before everything goes POOF!")) {



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
        <img className="avatar-preview" src={user.avatarUrl || `https://cdn.makuwro.com/${user.avatarPath}`} />
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
          <p>Your profile and content will become private and you'll be logged out everywhere.</p>
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
          <p>If you want to permanently delete your account and all content you uploaded, you may request to do so by pressing the button below.</p>
          <p>You will have 24 hours to cancel your request by signing back in, but after the time passes, all information you gave us will be deleted.</p>
          <form onSubmit={deleteAccount}>
            <label>Password</label>
            <input type="password" value={password} onInput={(event) => setPassword(event.target.value)} />
            <input type="submit" className="destructive" value="Delete account" />
          </form>
        </SettingsDropdown>
      </section>
    </>
  );

}