import React from "react";

function Preferences() {

  return (
    <>
      <main id="preferences-container">
        <p>Everything is saved automatically</p>
        <section>
          <h1>Contributing</h1>
          <form>
            <section>
              <label htmlFor="contributorName">Contributor name<button>?</button></label>
              <input type="text" name="contributorName" />
            </section>
            <section>
              <label htmlFor="contributorName">Username<button>?</button></label>
              <input type="text" name="contributorName" />
            </section>
            <section>
              <label htmlFor="userId">User ID<button>?</button></label>
              <input type="text" name="userId" value="Unknown" readOnly />
            </section>
          </form>
        </section>
        <section>
          <h1>Appearance</h1>
          <form>
            <section>
              <label htmlFor="theme">Theme<button>?</button></label>
              <select name="theme">
                <option>Day</option>
                <option>Night</option>
                <option>System</option>
              </select>
            </section>
          </form>
        </section>
        <section>
          <h1>Editing</h1>
          <form>
            <section>
              <input type="checkbox" name="warn-unsaved-edits" />
              <label htmlFor="warn-unsaved-edits">Warn me if I leave the editor with unsaved changes</label>
            </section>
            <section>
              <input type="checkbox" name="auto-collab" />
              <label htmlFor="auto-collab">Automatically enable collaboration mode when editing</label>
            </section>
          </form>
        </section>
        <section>
          <h1>Connections</h1>
          <form>
            <label htmlFor="github">GitHub<button>?</button></label>
            <input type="button" name="github" value="Connect with GitHub" />
          </form>
        </section>
      </main>
    </>

  );

}

export default Preferences;