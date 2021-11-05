import React from "react";

function AccountManager() {

  document.title = "Accounts - The Showrunners Wiki Settings";

  return (
    <section>
      <section>
        <h1>Accounts</h1>
        <p>You can manage account info (usernames, contributor names, emails, etc.), statuses, roles, and other useful things relating to accounts here.</p>
      </section>
      <section>
        <button>Create account</button>
      </section>
    </section>
  );

}

export default AccountManager;