import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Settings.module.css";
import SettingsDropdown from "./SettingsDropdown";

export default function AccountSettings({currentUser, setCurrentUser}) {

  const navigate = useNavigate();
  const [menu, setMenu] = useState();
  const [selectedField, setSelectedField] = useState();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [submitting, setSubmitting] = useState(false);
  document.title = "Account settings / Makuwro";
  
  function resetFields(newField) {

    setSelectedField(newField);
    setDisplayName("");
    setUsername("");
    setOldPassword("");
    setPassword("");
    setPasswordAgain("");

  }

  async function disableAccount() {

    if (!submitting && confirm("Are you sure you want to disable your account? You can come back at any time.")) {

      setSubmitting(true);

      // Send a request to disable the account

      // Delete the token cookie
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Redirect to the home page
      navigate("/");

    }

  }

  async function deleteAccount() {

    if (!submitting && confirm("Woahh there, buddy. Are you sure you want to delete your account? You will have 24 hours to change your mind by signing in before everything goes POOF!")) {

      setSubmitting(true);

    }

  }

  async function updateAccount(event, key, value) {

    // Don't refresh the page, please.
    event.preventDefault();

    if (key === "password" && passwordAgain !== password) {

      return alert("Your password doesn't match!");

    }

    if (!submitting) {

      // Prevent multiple requests while we do this.
      setSubmitting(true);
      
      // Make sure the username was changed before submitting the request.
      if (value && value !== currentUser[key]) {
        
        try {

          // Turn it into a FormData object.
          const formData = new FormData();
          formData.append(key, value);
          if (oldPassword) {

            formData.append("oldPassword", oldPassword);

          } else if (key === "email") {

            formData.append("password", password);

          }

          // Send the request to change the value.
          const response = await fetch(`${process.env.RAZZLE_API_DEV}accounts/user`, {
            method: "PATCH",
            headers: {
              token: currentUser.token
            },
            body: formData
          });

          if (response.ok) {

            // Save the new username to the state.
            if (key !== "password") {

              setCurrentUser({...currentUser, [key]: value});

            }

            // Reset the field.
            resetFields();

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

  function toggleMenu(index) {

    if (index === menu) {

      setMenu();
      resetFields();

    } else {

      setMenu(index);

    }

  }

  return (
    <>
      <section id={styles.welcome}>
        <img className={styles.avatar} src={`https://cdn.makuwro.com/${currentUser.avatarPath}`} />
        <h1>Hi, {currentUser.displayName || currentUser.username}!</h1>
        <p>You can manage your account information here.</p>
      </section>
      <section id={styles.options}>
        <SettingsDropdown 
          title="Display name" 
          description="This is your preferred name when using Makuwro. We'll show this before your username." 
          open={menu === 0} 
          onClick={() => toggleMenu(0)}
        >
          {selectedField === 0 ? (
            <form onSubmit={(event) => updateAccount(event, "displayName", displayName)}>
              <label>New display name</label>
              <input type="text" placeholder={currentUser.displayName} value={displayName} onInput={(event) => setDisplayName(event.target.value)} />
              <input type="submit" value="Save" disabled={submitting} />
            </form>
          ) : (
            <>
              {currentUser.displayName && (
                <p>Your current display name is <b>{currentUser.displayName}</b>.</p>
              )}
              <button onClick={() => resetFields(0)}>Change display name</button>
            </>
          )}
        </SettingsDropdown>
        <SettingsDropdown
          title="Username"
          description="This unique name is used for signing in and for other members to identify you."
          open={menu === 1}
          onClick={() => toggleMenu(1)}
        >
          {selectedField === 1 ? (
            <form onSubmit={(event) => updateAccount(event, "username", username)}>
              <label>New username</label>
              <input type="text" placeholder={currentUser.username} value={username} onInput={(event) => setUsername(event.target.value)} />
              <input type="submit" value="Save" disabled={submitting} />
            </form>
          ) : (
            <>
              <p>Your current username is <b>{currentUser.username}</b>.</p>
              <button onClick={() => resetFields(1)}>Change username</button>
            </>
          )}
        </SettingsDropdown>
        <SettingsDropdown
          title="Password"
          description="This, along with your username, is used for signing you in."
          open={menu === 2}
          onClick={() => toggleMenu(2)}
        >
          {selectedField === 2 ? (
            <form onSubmit={(event) => updateAccount(event, "password", password)}>
              <label>Current password</label>
              <input type="password" required value={oldPassword} onInput={(event) => setOldPassword(event.target.value)}  />
              <label>New password</label>
              <input type="password" required value={password} onInput={(event) => setPassword(event.target.value)} />
              <label>Confirm new password</label>
              <input type="password" required value={passwordAgain} onInput={(event) => setPasswordAgain(event.target.value)}  />
              <input type="submit" value="Save" disabled={submitting} />
            </form>
          ) : <button onClick={() => resetFields(2)}>Change password</button>}
        </SettingsDropdown>
        <SettingsDropdown 
          title="Email address"
          description="This email address is only used for authenticating you. If you forgot your password, you can use this email to reset it."
          open={menu === 3} 
          onClick={() => toggleMenu(3)}
        >
          {selectedField === 3 ? (
            <form>
              <label>Email address</label>
              <input type="email" required />
              <label>Password</label>
              <input type="password" required />
              <input type="submit" value="Save" disabled={submitting} />
            </form>
          ) : <button onClick={() => resetFields(3)}>Change email address</button>}
        </SettingsDropdown>
        <SettingsDropdown
          title="Disable your account"
          description="If you want to take a break, you can disable your account."
          open={menu === 4} 
          onClick={() => toggleMenu(4)}
        >
          <p>Your profile and content will become private and you'll be logged out everywhere.</p>
          <p>You can re-enable your account by signing back in.</p>
          <button className="destructive" onClick={disableAccount}>Disable account</button>
        </SettingsDropdown>
        <SettingsDropdown 
          title="Delete your account"
          open={menu === 5} 
          onClick={() => toggleMenu(5)}
        >
          <p>If you want to permanently delete your account and all content you uploaded, you may request to do so by pressing the button below.</p>
          <p>You will have 24 hours to cancel your request by signing back in, but after the time passes, all information you gave us will be deleted.</p>
          <button className="destructive" onClick={deleteAccount}>Delete account</button>
        </SettingsDropdown>
      </section>
    </>
  );

}