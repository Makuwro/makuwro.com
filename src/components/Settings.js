import React from "react";
import Header from "./Header";
import styles from "../styles/Settings.module.css";
import { Link } from "react-router-dom";
import CodeManager from "./settings/CodeManager";
import PropTypes from "prop-types";
import AccountManager from "./settings/AccountManager";
import RoleManager from "./settings/RoleManager";
import Prompt from "./Prompt";

function Settings(props) {

  document.title = "The Showrunners Wiki Settings";

  // Generate left bar
  const navigation = {
    "Membership": [
      ["accounts", "Accounts"],
      ["audit-log", "Audit log"],
      ["codes", "Codes"],
      ["roles", "Roles"]
    ],
    "Pages": [
      ["articles", "Articles"],
      ["categories", "Categories"],
      ["special-pages", "Special pages"],
      ["templates", "Templates"],
    ],
    "Maintenance": [
      ["storage", "Storage and database"]
    ]
  };
  const navCategories = Object.keys(navigation);
  const navChildren = [];
  const requestedMenu = props.match ? props.match.params.menu : "";
  for (let i = 0; navCategories.length > i; i++) {

    // Get every nav item
    const linkList = [];
    const navCategoryName = navCategories[i];
    const navCategory = navigation[navCategoryName];
    for (let x = 0; navCategory.length > x; x++) linkList.push(<li key={`${navCategoryName}li${x}`} id={requestedMenu === navCategory[x][0] ? styles["settings-nav-selected"] : null}><Link to={navCategory[x][0]}>{navCategory[x][1]}</Link></li>);
    
    // Add it to a <ul>
    const navUl = <ul key={`${navCategoryName}ul`}>{linkList}</ul>;

    // Add it to the nav bar, along with the category name
    navChildren.push(React.createElement("section", {key: `${navCategoryName}section`}, [<h1 key={`${navCategoryName}heading`}>{navCategoryName}</h1>, navUl]));

  }

  // Generate the selectedMenu
  const promptProps = {
    visible: React.useState(false),
    title: React.useState(null),
    description: React.useState(null),
    options: React.useState(null)
  };
  const menus = {
    codes: CodeManager,
    accounts: AccountManager,
    roles: RoleManager
  };
  const menuState = menus[requestedMenu] ? React.createElement(menus[requestedMenu], {key: requestedMenu, prompt: promptProps}, null) : null;

  return (
    <>
      <Header {...props} />
      <main id={styles["settings-main"]}>
        <nav id={styles["settings-nav"]}>
          {navChildren}
        </nav>
        {menuState}
      </main>
      <Prompt {...promptProps} />
    </>
  );

}

Settings.propTypes = {
  match: PropTypes.object
};

export default Settings;