import React from "react";
import styles from "../styles/Authentication.module.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

class UserRegistration extends React.Component {

  constructor(props) {
    
    super(props);
    document.title = "Register an account on The Showrunners Wiki";

    // Bind functions
    const functionNames = ["openDialog", "sendAccountCreationRequest", "validatePassword"];
    for (let i = 0; functionNames.length > i; i++) this[functionNames[i]].bind(this);

    this.state = {
      code: "",
      email: "",
      password: "",
      passwordConfirm: "",
      passwordInvalid: false,
      username: ""
    };

  }

  openDialog(e, title, description) {

    e.preventDefault();
    //React.createElement(Explanation, {title: title, description: description}, null);
    alert(description);

  }

  async sendAccountCreationRequest(e) {

    // Don't refresh the page automatically
    e.preventDefault();

    // We don't want to spam the server ;)
    if (this.state.passwordInvalid || this.state.unavailable) return;
    this.setState({unavailable: true}, async () => {

      try {

        const response = await fetch(`${process.env.RAZZLE_WIKI_SERVER}/accounts`, {
          method: "POST",
          headers: {
            ...this.state, 
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) throw new Error(response.statusCode);
        this.props.history.replace("/login");
  
      } catch (err) {
  
        console.log(`Couldn't create account: ${err.message}`);
        this.setState({unavailable: false});
  
      }

    });

  }

  validatePassword() {

    if (this.state.passwordInvalid && (this.state.passwordConfirm === "" || this.state.password === this.state.passwordConfirm)) {

      this.setState({passwordInvalid: false});

    } else if (!this.state.passwordInvalid && this.state.password !== this.state.passwordConfirm) {

      this.setState({passwordInvalid: true});

    }

  }
  
  componentDidUpdate(oldProps, oldState) {

    if (oldState.password === this.state.password && oldState.passwordConfirm === this.state.passwordConfirm) return;
    this.validatePassword();

  }

  render() {

    return (
      <main id={styles["auth-main"]}>
        <section>
          <section>To view and edit articles, you need an account.</section>
          <form onSubmit={(e) => this.sendAccountCreationRequest(e)}>
            <section>
              <label htmlFor="username">Username<button tabIndex="-1" onClick={e => this.openDialog(e, "Username", "You will use this unique name to sign in.")}>?</button></label>
              <input type="text" name="username" required onChange={(e) => this.setState({username: e.target.value})} />
            </section>
            <section>
              <label htmlFor="contributor_name">Contributor name<button tabIndex="-1" onClick={e => this.openDialog(e, "Contributor name", "This name will be shown when you edit articles.")}>?</button></label>
              <input type="text" name="contributor_name" onChange={(e) => this.setState({contributor_name: e.target.value})} />
            </section>
            <section>
              <label htmlFor="email">Email address<button tabIndex="-1" onClick={e => this.openDialog(e, "Email address", "This address will be used to verify your identity if you need your password reset.")}>?</button></label>
              <input type="email" name="email" onChange={(e) => this.setState({email: e.target.value})} />
            </section>
            <section>
              <label htmlFor="password">Password<button tabIndex="-1" onClick={e => this.openDialog(e, "Password", "This, along with your username, will be used to log you in.")}>?</button></label>
              <input type="password" name="password" required onBlur={() => this.validatePassword()} onChange={(e) => this.setState({password: e.target.value})} />
            </section>
            <section>
              <label htmlFor="passwordConfirm">Confirm password<button tabIndex="-1" onClick={e => this.openDialog(e, "Confirm password", "just type your password again")}>?</button></label>
              <input style={this.state.passwordInvalid ? {borderColor: "red"} : null} type="password" name="passwordConfirm" required onBlur={() => this.validatePassword()} onChange={(e) => this.setState({passwordConfirm: e.target.value}, () => this.validatePassword())} />
            </section>
            <section>
              <label htmlFor="registrationCode">Registration code<button tabIndex="-1" onClick={e => this.openDialog(e, "Registration code", "You must enter the code given to you by the administrators to sign up to the wiki.")}>?</button></label>
              <input type="text" name="registrationCode" onChange={(e) => this.setState({code: e.target.value})} />
            </section>
            <section style={{display: "flex", alignItems: "center", marginTop: "2rem"}}>
              <input type="submit" value="Create account" />
              <Link to="/login" style={{color: "white", marginLeft: "1rem", border: "none"}}>Sign in instead</Link>
            </section>
          </form>
        </section>
      </main>
    );

  }

}

UserRegistration.propTypes = {
  history: PropTypes.object
};

export default UserRegistration;