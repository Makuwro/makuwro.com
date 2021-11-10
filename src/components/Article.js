import React from "react";
import styles from "../styles/Settings.module.css";
import PropTypes from "prop-types";
import LoadingScreen from "./LoadingScreen";
import { withRouter, Link } from "react-router-dom";
import FormattingTools from "./FormattingTools";

const markupRegex = /(?<li>\* (?<licontent>[^\n]+))|(?<h1># (?<h1Content>.+))|(?<h2>## (?<h2Content>.+))|(?<h3>### (?<h3Content>.+))|(?<element><(\w+?)( (?<elementAttribs>\w+=".+?|")|)>(?<elementText>.+?)<\/\w+?>)|(?<b>\*\*(?<bContent>.+?)\*\*)|(?<i>\*(?<iContent>.+?)\*)|(?<template>\{\{(?<templateName>[^|]+)\|?(?<parameters>.+)?\}\})|(?<link>\[(?<linkText>.*?)\]\((?<linkURL>[^[\])]*\)?)\))|(?<del>~~(?<delText>.+)~~)|(?<newLine>\n)/gm;
const headerDictionary = {"h1": 1, "h2": 1, "h3": 1, "h4": 1, "h5": 1, "h6": 1};
const wikiServer = process.env.RAZZLE_WIKI_SERVER;

const pageContentCache = {};

class Article extends React.Component {
  
  constructor(props) {

    super(props);

    // Create refs
    const refs = ["articleContainer", "pageName", "firstElement", "articleContent"];
    for (let i = 0; refs.length > i; i++) this[refs[i]] = React.createRef();

    // Bind functions
    const functionNames = ["formatMetadata", "setupArticle", "updateMode", "updateName", "updateContent", "saveArticle", "selectContent"];
    for (let i = 0; functionNames.length > i; i++) this[functionNames[i]].bind(this);

    // Set initial state
    this.state = {
      ready: false,
      mode: new URLSearchParams(document.location.search).get("mode") || "view"
    };

  }

  formatMetadata(data) {

    const source = data.source;
    let headers = [], formattedContent, contributors;

    // Make the content look pretty
    const matches = source ? [...source.matchAll(markupRegex)] : [];
    const componentsToFormat = [];
    let currentUl = [];
    if (matches.length === 0) componentsToFormat.push(<p>{source}</p>);
    let currentDiv = [];
    let currentPosition = 0;
    for (let i = 0; matches.length > i; i++) {

      // Get the match
      const match = matches[i];
      let matchType = Object.keys(match.groups).filter(key => match.groups[key])[0];
      let matchText = match.groups[matchType];

      // Add previous text
      let stringToAdd = source.substring(currentPosition, match.index);
      if (stringToAdd.trim() !== "") currentDiv.push(<React.Fragment key={`${i}f`}>{stringToAdd}</React.Fragment>);
      currentPosition += stringToAdd.length;

      // Check if it's a new line
      switch (matchType) {

        case "i":
        case "b":
          matchText = matchType === "i" ? match.groups.iContent : match.groups.bContent;
          break;

        case "h1":
        case "h2":
        case "h3":
          matchText = match.groups[matchType + "Content"];
          break;

        case "link": 

          matchText = match.groups.linkText;
          break;

        case "del": {

          matchText = match.groups.delText;
          break;

        }

        case "template": {

          // Get the template info
          //const templateName = match.groups.templateName;
          //const parameters = match.groups.parameters;
          //const matchedParams = parameters && [...parameters.matchAll(/(?<param>[^|=]+)=?(?<value>[^|]*)\|?/gm)];

          // Get the template data from the server

          // Replace the template
          matchText = <></>;

          break;

        }

        case "newLine": {

          const stringToAdd = source.substring(currentPosition, match.index);
          if (stringToAdd.trim() !== "") currentDiv.push(<React.Fragment key={`${i}f2`}>stringToAdd</React.Fragment>);
          currentPosition += stringToAdd.length;

          // Wrap it in a container
          if (currentDiv.length > 0 && (typeof(currentDiv[0]) === "object" || (typeof(currentDiv[0]) === "string" && currentDiv[0].trim() !== ""))) {
            
            componentsToFormat.push(<p>{currentDiv}</p>);
            currentDiv = [];

          }

          break;

        }

        case "li": {

          // Get the matches inside the new line
          const subMatchText = match.groups.licontent || matchText;
          const subMatchArray = [...subMatchText.matchAll(markupRegex)];
          const listChildren = [];
          let subMatchIndex = 0;
          for (let x = 0; subMatchArray.length > x; x++) {

            const subMatch = subMatchArray[x];
            const subMatchType = Object.keys(subMatch.groups).filter(key => subMatch.groups[key])[0];

            stringToAdd = subMatchText.substring(subMatchIndex, subMatch.index);
            if (stringToAdd.length > 0) listChildren.push(<React.Fragment key={`${x}f`}>{stringToAdd}</React.Fragment>);
            subMatchIndex = subMatch.index;
            switch (subMatchType) {

              case "link": {

                const url = subMatch.groups.linkURL;
                const external = url.match(/^(http|www\.)/g);
                const elementType = external ? "a" : Link;
                listChildren.push(React.createElement(elementType, {
                  key: x, 
                  to: external ? undefined : `/articles/${url}`, 
                  href: external ? url : undefined,
                  target: external ? "_blank" : null
                }, subMatch.groups.linkText.replace("_", " ")));
                break;

              }

              case "b":
              case "i":
                listChildren.push(React.createElement(subMatchType, {key: x}, subMatchType === "i" ? match.groups.iContent : match.groups.bContent));
                break;

              default:
                break;

            }

            subMatchIndex += subMatch.groups[subMatchType].length;

          }

          // Add the rest of the line
          const excessString = subMatchText.substring(subMatchIndex, subMatchText.length);
          if (excessString) listChildren.push(excessString);

          matchText = listChildren;
          break;

        }

        default:
          console.warn("Unknown match type: " + matchType);
          break;

      }
      
      // Keep track of the index
      currentPosition += (match.groups[matchType] || match.groups[matchType.toLowerCase()]).length;

      if (matchType !== "newLine") {

        // Create the element and add it to the header list, if necessary
        const external = matchType === "link" && match.groups.linkURL.match(/^(http|www\.)/g);
        const elementType = matchType === "link" ? (external ? "a" : Link) : (matchType === "template" ? React.Fragment : matchType);
        const isHeader = headerDictionary[elementType];
        const Element = React.createElement(elementType, {
          key: i, 
          id: isHeader ? matchText.replaceAll(" ", "_") : null, 
          to: matchType === "link" && !external ?  `/articles/${match.groups.linkURL}` : null,
          href: matchType === "link" && external ? match.groups.linkURL : null,
          target: external ? "_blank" : null
        }, matchText);
        if (Element.props.id) {

          headers.push(elementType === "h1" ? (
            <h1 key={headers.length}>
              <a href={`#${Element.props.id}`}>{matchText}</a>
            </h1>
          ) : (
            <ul key={headers.length}>
              <li style={elementType !== "h2" ? {marginLeft: "0.75rem"} : null}>
                <a href={`#${Element.props.id}`}>{matchText}</a>
              </li>
            </ul>
          ));

        }
        currentDiv.push(Element);

        if (isHeader || {li: 1, template: 1}[matchType]) {

          if (matchType === "li") {

            currentUl.push(Element);

          } else {

            if (currentUl[0]) {

              componentsToFormat.push(<ul>{currentUl}</ul>);
              currentUl = [];

            }
            componentsToFormat.push(<>{currentDiv}</>);

          }
          currentDiv = [];
          
        }

      }

    }

    if (currentUl[0]) {

      componentsToFormat.push(<ul>{currentUl}</ul>);
      currentUl = [];

    }

    // Add the rest of the string, if needed
    if (source && currentPosition !== source.length) componentsToFormat.push(<p>{source.substring(currentPosition, source.length)}</p>);

    // Format the components
    formattedContent = source && componentsToFormat.map((component, index) => <React.Fragment key={index}>{component}</React.Fragment>);
    
    // Put the contributors in a list
    /*
    contributors = props.data.commits ? [] : "The Showrunners Team";
    const commits = props.data.commits || [];
    for (let i = 0; commits.length > i; i++) {

      const contributorName = commits[i].author.login;
      if (!contributors.find(existingName => existingName === contributorName)) contributors.push(contributorName);

    }
    */

    this.setState({
      content: formattedContent,
      ready: true,
      contributors: contributors || "The Showrunners Team",
      headers: headers
    });

  }

  async setupArticle() {

    // Get article info
    const {match: {params: {name}}, type, history} = this.props;

    // Make sure we show the correct name
    const shownName = name.replaceAll("_", " ");
    this.setState({name: shownName});

    // Get the cookie. If we don't have it, redirect to login page
    const value = `; ${document.cookie}`;
    const parts = value.split("; token=");
    const token = parts.length === 2 && parts.pop().split(";")[0];
    if (!token) {

      history.push(`/login?redirect=/articles/${name}`);
      return;

    }

    try {

      // Get article contents
      const cachedJson = pageContentCache[type + name];
      const pageResponse = cachedJson ? {status: 200} : await fetch(`${wikiServer}/pages/${name}`, {
        headers: {
          token: token
        }
      });
      const articleJson = cachedJson || (pageResponse.ok ? await pageResponse.json() : {});

      // Check which response we got
      switch (pageResponse.status) {

        case 401:
          return history.push(`/login?redirect=/articles/${name}`);

        case 404:
        case 200: {
        
          // Save the content to lower the chance we get rate-limited
          pageContentCache[type + name] = articleJson;

          // Prepare category page, if necessary
          if (type === "category") {

            const allCategories = JSON.parse(articleJson.content);
            const category = allCategories && allCategories[name];
            articleJson.content = allCategories ? (category ? `Below are articles in the "${shownName}" category:\n` : "") : articleJson.content;
            if (category) {

              for (const [articleName, inCategory] of Object.entries(category)) {

                articleJson.content = articleJson.content + (inCategory ? `* [${articleName.replaceAll("_", " ")}](${articleName})\n` : "");

              }

            }

          }

          // Format metadata
          if (articleJson.time) this.setState({time: new Date(articleJson.time)});
          this.formatMetadata(articleJson);
          break;
          
        }

        default:
          break;

      }

      // Go to hash after loading
      const hash = location.hash;
      if (hash !== "" && document.getElementById(location.hash.substring(1))) {

        location.replace(hash);
        window.scrollBy(0, -80);

      }

    } catch (err) {

      console.log(`[Article]: Couldn't fetch: ${err.message}`);
      this.setState({
        ready: true,
        name: "Timed out",
        content: "But that's juuuuuuuuust fine.",
        mode: "view"
      });

    }

  }

  async componentDidMount() {

    // Make sure we're using underscores instead of spaces
    const {match: {params: {name}}, history} = this.props;
    const underscoreInternalName = name.replaceAll(" ", "_");
    document.title = `${name} - The Showrunners Wiki`;
    if (name !== underscoreInternalName) return history.replace(`/articles/${underscoreInternalName}${location.hash}`);

    await this.setupArticle();
    
  }

  async componentDidUpdate(prevProps) {

    document.title = `${this.state.name} - The Showrunners Wiki`;
    if (prevProps.match.params.name === this.props.match.params.name) return;
    this.setState({ready: false});
    await this.setupArticle();

  }

  updateMode(mode) {

    this.setState({mode: mode});

  }

  updateName(e) {

    if (e.keyCode === 13) {

      e.preventDefault();
      this.pageName.current.blur();

      const name = e.target.innerHTML;
      this.setState({name: name}, () => history.replaceState(null, null, `/articles/${name.replaceAll(" ", "_")}?mode=edit`));

    }

  }

  updateContent(e) {

    // Don't delete the initial element, please
    const firstElement = this.firstElement.current;
    if ((e.keyCode == 8 || e.keyCode == 46) && firstElement && firstElement.children.length === 1 && firstElement.children[0].innerText < 1) e.preventDefault();

  }

  async saveArticle() {

    console.log("Converting article to source string...");
    // Convert the elements to a Markdown string
    const children = this.articleContent.current.children;
    let source = "";
    for (let i = 0; children.length > i; i++) {

      const child = children[i];
      const nodeName = child.nodeName;
      switch (nodeName) {

        case "P":
          for (let x = 0; child.childNodes.length > x; x++) {

            const grandChild = child.childNodes[x];
            const grandNodeName = grandChild.nodeName;
            if (grandChild.nodeValue !== null && grandChild.nodeValue.trim() === "") continue;

            source += (i !== 0 && x === 0 ? "\n" : "");

            switch (grandNodeName) {

              case "A":
                source += `[${grandChild.innerText}](${grandChild.href})`;
                break;

              case "B":
                source += `**${grandChild.innerText}**`;
                break;

              case "I":
                source += `*${grandChild.innerText}*`;
                break;
              
              case "U":
                source += `__${grandChild.innerText}__`;
                break;

              default:
                source += grandChild.nodeValue;
                break;

            }

          }
          break;

        case "H1":
        case "H2":
        case "H3":
          source += `${i !== 0 ? "\n" : ""}${(nodeName === "H1" || children[i - 1] && children[i - 1].nodeName !== "H1") && i !== 0 ? "\n" : ""}${"#".repeat(nodeName.substring(1))} ${child.innerText}`;
          break;

        case "UL":
          for (let x = 0; child.childNodes.length > x; x++) {

            console.log(child.childNodes[x].nodeName);

          }

          source += `${i !== 0 ? "\n" : ""}* ${child.innerText}`;
          break;

        default:
          break;

      }

    }

    try {

      // Push the source string to the server
      console.log("Uploading source string to server...");
      const response = await fetch(`${wikiServer}/pages/${this.state.name.replaceAll(" ", "_")}`, {
        method: "PUT",
        headers: {
          token: this.props.token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({source: source})
      });

      if (!response.ok) throw new Error(response.status);

      // Done!
      console.log("Successfully saved the article!");

    } catch (err) {

      console.log(`Couldn't save article: ${err.message}`);

    }

  }

  pasteContent(e) {

    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);

  }

  selectContent() {

    const nodeName = document.getSelection().anchorNode.parentElement.nodeName;
    const dropdownOptions = {H1: "Heading 1", H2: "Heading 2", H3: "Heading 3", P: "Paragraph"};
    this.setState({dropdownOption: dropdownOptions[nodeName]});

  }

  render() {

    // Go to header if it changes
    if (typeof window !== "undefined" && typeof document !== "undefined") window.onhashchange = () => document.getElementById(location.hash.substring(1)) && window.scrollBy(0, -80);

    document.execCommand("defaultParagraphSeparator", false, "p");

    const {theme, systemDark, userCache} = this.props;
    const {name, mode, content, ready, dropdownOption, time, headers} = this.state;
    let formattedTime = this.state.time ? `${time.toLocaleString("default", {month: "long"})} ${time.getDate()}, ${time.getFullYear()}` : null;

    return (

      <main className={theme !== 1 && (theme !== 2 || !systemDark) ? "day" : null} id={styles["settings-main"]} ref={this.articleContainer}>
        <nav id={styles["settings-nav"]}>
          <h1>{name}</h1>
          <section>{headers}</section>
        </nav>
        <article className={styles["dark-article"]}>
          {mode === "edit" && <FormattingTools dropdownOption={dropdownOption} onSaveButton={async () => this.saveArticle()} />}
          <section id={styles["article-header"]}>
            {ready && userCache._id && (
              <section id={styles["article-controls"]}>
                <button onClick={() => this.updateMode(mode !== "edit" ? "edit" : "view")}>{content ? (mode !== "edit" ? "Edit" : "Finish editing") : "Create"}</button>
              </section>
            )}
            <h1 id={styles["article-header-name"]} ref={this.pageName} onKeyDown={(e) => this.updateName(e)} suppressContentEditableWarning={true} contentEditable={mode === "edit"}>
              {name}
            </h1>
          </section>

          {ready ? (
            <>
              <section onSelect={() => this.selectContent()} onPaste={(e) => this.pasteContent(e)} ref={this.articleContent} onKeyDown={(e) => this.updateContent(e)} id={styles["article-content"]} suppressContentEditableWarning={true} contentEditable={mode === "edit"}>
                {content || (mode === "view" ? (
                  <p>This article doesn't exist... <i>but it always will in our hearts ♥</i></p>
                ) : <p ref={this.firstElement} placeholder="It goes a little something like this..."></p>)}
              </section>

              {content && (
                <section id={styles["article-footer"]}>
                  <div id={styles["last-edited"]}>Last edited on {formattedTime || "the darkest day"}</div>
                </section>
              )}
            </>
          ) : <LoadingScreen />}
        </article>
      </main>
      
    );

  }

}

Article.propTypes = {
  match: PropTypes.object,
  type: PropTypes.string,
  history: PropTypes.object,
  userCache: PropTypes.object,
  token: PropTypes.string,
  theme: PropTypes.number,
  systemDark: PropTypes.bool
};

export default withRouter(Article);