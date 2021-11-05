import React from "react";
import styles from "../../styles/Settings.module.css";

function CodeManager(props) {

  document.title = "Codes - The Showrunners Wiki Settings";

  const prompt = () => {

    // Set the prompt details
    props.prompt.title[1]("Create code");
    props.prompt.description[1](
      <>
        <form>
          <p>This code can be used by visitors to create an account.</p>
          <input type="text" placeholder="Pick a code, any code" required />
        </form>
      </>
    );
    props.prompt.options[1](
      <>
        <button>Create</button>
        <button onClick={() => props.prompt.visible[1](false)}>Cancel</button>
      </>
    );
    props.prompt.visible[1](true);

  };

  return (
    <section>
      <section>
        <h1>Registration codes</h1>
        <p>You can generate secret codes to let people to sign up for the wiki.</p>
      </section>
      <section>
        <h2>Active codes</h2>
        <p>There aren't any codes that visitors can use right now. Why not create one?</p>
        <section style={{display: "flex"}}>
          <button onClick={prompt}>Create code</button>
          <form style={{marginLeft: "1rem", flexGrow: 1}}>
            <input type="text" placeholder="Search for a code..."></input>
          </form>
        </section>
        <ul id={styles["settings-list"]}>
          <li>
            <section>CodeName</section>
            <section>1 use remaining</section>
          </li>
          <li>
            <section>AnotherCode</section>
            <section>1 use remaining</section>
          </li>
          <li>
            <section>AnotherCode</section>
            <section>1 use remaining</section>
          </li>
          <li>
            <section>AnotherCode</section>
            <section>1 use remaining</section>
          </li>
          <li>
            <section>AnotherCode</section>
            <section>1 use remaining</section>
          </li>
        </ul>
        <p>No codes found!</p>
      </section>
      <section>
        <h2>Used codes</h2>
        <p>There are currently no codes successfully used by visitors.</p>
      </section>
      <section>
        <h2>Who can create codes?</h2>
        <p>Those who have at least one of the following roles can create codes:</p>
      </section>
    </section>
  );

}

export default CodeManager;