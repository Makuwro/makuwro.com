import React from "react";
import styles from "../styles/Article.module.css";
import Header from "./Header";
import Link from "next/link";
import PropTypes from "prop-types";
import router from "next/router";

const markupRegex = /(?<li>\* (?<licontent>[^\n]+)(?<liEnd>))|(?<h1># (?<h1Content>.+))|(?<h2>## (?<h2Content>.+))|(?<h3>### (?<h3Content>.+))|(?<element><(\w+?)( (?<elementAttribs>\w+=".+?|")|)>(?<elementText>.+?)<\/\w+?>)|(?<b>\*\*(?<bContent>.+?)\*\*)|(?<i>\*(?<iContent>.+?)\*)|(?<template>\{\{(?<templateName>[^|]+)\|?(?<parameters>.+)?\}\})|(?<link>\[(?<linkText>.*?)\]\((?<linkURL>[^[\])]*\)?)\))|(?<del>~~(?<delText>.+)~~)|(?<newLine>\n)/gm;
const headerDictionary = {"h1": 1, "h2": 1, "h3": 1, "h4": 1, "h5": 1, "h6": 1};
const wikiServer = process.env.NEXT_PUBLIC_WIKI_SERVER;

const pageContentCache = {};

class Article extends React.Component {
  
  constructor(props) {

    super(props);
    this.formatMetadata = this.formatMetadata.bind(this);
    this.setupArticle = this.setupArticle.bind(this);
    this.articleContainer = React.createRef();
    this.state = {
      ready: false
    };

  }

  formatMetadata(data) {

    const content = data.content;
    let headers = [], formattedContent, contributors;

    // Make the content look pretty
    const matches = content ? [...content.matchAll(markupRegex)] : [];
    const componentsToFormat = [];
    if (matches.length === 0) componentsToFormat.push(<div>{content}</div>);
    let currentDiv = [];
    let currentPosition = 0;
    for (let i = 0; matches.length > i; i++) {

      // Get the match
      const match = matches[i];
      let matchType = Object.keys(match.groups).filter(key => match.groups[key])[0];
      let matchText = match.groups[matchType];

      // Add previous text
      let stringToAdd = content.substring(currentPosition, match.index);
      if (stringToAdd) currentDiv.push(React.Fragment, null, stringToAdd);
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
          const templateName = match.groups.templateName;
          const parameters = match.groups.parameters;
          const matchedParams = parameters && [...parameters.matchAll(/(?<param>[^|=]+)=?(?<value>[^|]*)\|?/gm)];

          // Get the template data from the server

          // Replace the template
          matchText = <></>;

          break;

        }

        case "newLine": {

          const stringToAdd = content.substring(currentPosition, match.index);
          if (stringToAdd) currentDiv.push(React.Fragment, null, stringToAdd);
          currentPosition += stringToAdd.length;

          // Wrap it in a container
          // TODO: ul should include previous li elements
          if (currentDiv.length > 0) componentsToFormat.push(React.createElement(currentDiv.find(element => element && element.type === "li") ? "ul" : "p", null, currentDiv));
          currentDiv = [];

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
            if (stringToAdd.length > 0) listChildren.push(<>{stringToAdd}</>);
            switch (subMatchType) {

              case "link": {

                subMatchIndex = subMatch.index;
                const url = subMatch.groups.linkURL;
                listChildren.push(React.createElement(url.match(/^(http|www.)/g) ? "a" : Link, {href: `/articles/${url}`}, subMatch.groups.linkText.replace("_", " ")));
                break;

              }

              default:
                break;

            }

            subMatchIndex += subMatch.groups[subMatchType].length;

          }

          // Add the rest of the line
          const excessString = subMatchText.substring(subMatchIndex, subMatchText.length);
          if (excessString) listChildren.push(<>{excessString}</>);

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

        const elementType = matchType === "link" ? Link : (matchType === "template" ? React.Fragment : matchType);

        // Create the element and add it to the header list, if necessary
        const isHeader = headerDictionary[elementType];
        const Element = React.createElement(elementType, {key: i, id: isHeader && matchText.replaceAll(" ", "_"), href: elementType === Link ? (`/articles/${match.groups.linkURL}`) : undefined}, matchText);
        if (Element.props.id) headers.push(Element);
        currentDiv.push(Element);

        if (isHeader || {li: 1, template: 1}[matchType]) {

          componentsToFormat.push(React.createElement(matchType === "li" ? "ul" : React.Fragment, null, currentDiv));
          currentDiv = [];
          
        }

      }

    }

    // Add the rest of the string, if needed
    if (content && currentPosition !== content.length) componentsToFormat.push(<div>{content.substring(currentPosition, content.length)}</div>);

    // Format the components
    formattedContent = content && componentsToFormat.map(component => component);
    
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
    const {name, type} = this.props;

    // Make sure we show the correct name
    const shownName = name.replaceAll("_", " ");
    document.title = `${shownName} - The Showrunners Wiki`;
    this.setState({name: shownName});

    // Get the cookie
    const value = `; ${document.cookie}`;
    const parts = value.split("; access_token=");
    const token = parts.length === 2 && parts.pop().split(";")[0];

    // Get article contents
    const cachedJson = pageContentCache[type + name];
    const pageResponse = cachedJson ? {status: 200} : await fetch(wikiServer + "/api/contents/" + (type === "normal" ? "articles/" + name + ".md" : "categories.json"), {
      headers: {
        token: token
      }
    });
    const articleJson = cachedJson || (pageResponse.ok ? await pageResponse.json() : {});

    // Check which response we got
    switch (pageResponse.status) {

      case 401:
        return router.push(`/login?redirect=/articles/${name}`);

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
        this.formatMetadata(articleJson);
        break;
        
      }

      default:
        break;

    }

  }

  async componentDidMount() {

    // Make sure we're using underscores instead of spaces
    const {name} = this.props;
    const underscoreInternalName = name.replaceAll(" ", "_");
    if (name !== underscoreInternalName) {

      return router.push(`/articles/${underscoreInternalName}`);

    }

    await this.setupArticle();
    
  }

  async componentDidUpdate(prevProps) {

    if (prevProps.name === this.props.name) return;
    this.setState({ready: false});
    await this.setupArticle();

  }

  render() {

    return (
      <>
        <Header articleContainer={this.articleContainer} />
        {this.state.ready ? (
          <main ref={this.articleContainer} id="article-container">
            <article className={styles["dark-article"]}>
              <section id={styles["article-header"]}>
                <div id={styles["controls"]}>
                  <button>{this.state.content ? "Edit" : "Create"}</button>
                </div>
                <div>
                  <h1 id={styles["article-header-name"]}>{this.state.name}</h1>
                  {this.state.content && (<><div id="article-header-contributors">by {this.state.contributors}</div></>)}
                </div>
              </section>

              {/* 
                <Outline headers={this.state.headers} /> 
              */}

              <section id={styles["article-content"]}>{this.state.content || <>This article doesn't exist... <i>but it always will in our hearts ♥</i></>}</section>

              {this.state.content && (<section id={styles["article-footer"]}>
                <div id={styles["last-edited"]}>Last edited on January 1, 2021</div>
              </section>)}
            </article>
          </main>
        ) : null}
      </>
    );

  }

}

Article.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string
};

export default Article;