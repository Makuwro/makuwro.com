import React, { useState } from "react";
import styles from "../styles/Settings.module.css";

function RoleManager() {

  document.title = "Roles - The Showrunners Wiki Settings";
  const [roleEditorOpen, toggleRoleEditor] = useState(false);

  return (
    <section>
      <section id={styles["settings-save-section"]}>
        <section>
          <span>Remember to save your changes</span>
          <button>Save</button>
        </section>
      </section>
      <section style={roleEditorOpen ? {display: "none"} : null}>
        <h1>Roles</h1>
        <p>You can manage role names and permissions here.</p>
      </section>
      <section style={roleEditorOpen ? {display: "none"} : null}>
        <button onClick={() => toggleRoleEditor(true)}>Create role</button>
        <ul id={styles["settings-list"]}>
          <li onClick={() => toggleRoleEditor(true)}>
            <section>Developers</section>
            <section>2 users</section>
          </li>
          <li>
            <section>Makuwro Staff</section>
            <section>2 users</section>
          </li>
        </ul>
      </section>
      <section style={roleEditorOpen ? {borderTop: "none"} : {display: "none"}}>
        <section style={{display: "flex"}}>
          <button onClick={() => toggleRoleEditor(false)}>Back</button>
          <h1 style={{margin: "0 0 0 1rem"}}>Editing Role name</h1>
        </section>
        <form style={{marginTop: "1rem"}}>
          <input type="text" placeholder="Role name" />
          <h2>Permissions</h2>
          <section>
            <h3>Membership</h3>
            <section>
              <input type="checkbox" name="perm-accounts-manage" />
              <label htmlFor="perm-accounts-manage">Manage accounts</label>
            </section>
            <section>
              <input type="checkbox" name="perm-accounts-codes" />
              <label htmlFor="perm-accounts-codes">Manage codes</label>
            </section>
            <section>
              <input type="checkbox" name="perm-accounts-roles" />
              <label htmlFor="perm-accounts-roles">Manage roles</label>
            </section>
            <section>
              <input type="checkbox" name="perm-accounts-logs" />
              <label htmlFor="perm-accounts-logs">View audit log</label>
            </section>
          </section>
          <section>
            <h3>Articles</h3>
            <section>
              <input type="checkbox" name="perm-articles-edit" />
              <label htmlFor="perm-articles-edit">Edit article content</label>
            </section>
            <section>
              <input type="checkbox" name="perm-categories-manage" />
              <label htmlFor="perm-categories-manage">Manage categories</label>
            </section>
            <section>
              <input type="checkbox" name="perm-articles-sharing-manage" />
              <label htmlFor="perm-articles-sharing-manage">Manage article sharing settings</label>
            </section>
            <section>
              <input type="checkbox" name="perm-articles-view" />
              <label htmlFor="perm-articles-view">View article content</label>
            </section>
            <section>
              <input type="checkbox" name="perm-articles-view-history" />
              <label htmlFor="perm-articles-view-history">View article history</label>
            </section>
            <section>
              <input type="checkbox" name="perm-articles-view-sharing" />
              <label htmlFor="perm-articles-view-sharing">View article sharing settings</label>
            </section>
          </section>
          <section>
            <h3>Maintenance</h3>
            <section>
              <input type="checkbox" name="perm-maintenance-storage" />
              <label htmlFor="perm-maintenance-storage">View storage and database use</label>
            </section>
          </section>
        </form>
      </section>
    </section>
  );

}

export default RoleManager;