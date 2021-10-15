import React from "react";

function Preferences() {

  return (
  
    <main id="preferences-container">
      <p>Everything is saved automatically</p>
      <section>
        <h1>Your account</h1>
        <form>
          <label htmlFor="contributorName">Contributor name</label>
          <input type="text" name="contributorName" />
          <label htmlFor="userId">User ID</label>
          <input type="text" name="userId" readOnly />
        </form>
      </section>
      <section>
        <h1>Appearance</h1>
        <form>
          <label htmlFor="theme">Theme</label>
          <select name="theme">
            <option>Day</option>
            <option>Night</option>
          </select>
        </form>
      </section>
      <section>
        <h1>Connections</h1>
        <form>
          <label htmlFor="github">GitHub</label>
          <input type="button" name="github" value="Connect with GitHub" />
        </form>
      </section>
    </main>

  );

}

export default Preferences;