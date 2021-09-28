import React from "react";
import "../styles/article.css";
import Outline from "./Outline.js";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const markupRegex = /(?<li>\* (?<licontent>[^\n]+)(?<liEnd>))|(?<h1># (?<h1Content>.+))|(?<h2>## (?<h2Content>.+))|(?<h3>### (?<h3Content>.+))|(?<element><(\w+?)( (?<elementAttribs>\w+=".+?|")|)>(?<elementText>.+?)<\/\w+?>)|(?<b>\*\*(?<bContent>.+?)\*\*)|(?<i>\*(?<iContent>.+?)\*)|{{((?<template>\S+)}})|(?<link>\[(?<linkText>.*?)\]\((?<linkURL>[^[\]]*)\))|(?<del>~~(?<delText>.+)~~)|(?<newLine>\n)/gm;

const headerDictionary = {"h1": 1, "h2": 1, "h3": 1, "h4": 1, "h5": 1, "h6": 1};

class Article extends React.Component {
  
  constructor(props) {

    super(props);

    let contributors, formattedContent;
    let content = props.data.content;
 
    let headers = [];
    if (content) {

      // Make the content look pretty
      const matches = [...content.matchAll(markupRegex)];
      const componentsToFormat = [];
      if (matches.length === 0) componentsToFormat.push(<div>{content}</div>)
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
              console.log(subMatchText.substring(subMatchIndex, subMatch.index));
              switch (subMatchType) {

                case "link": {

                  subMatchIndex = subMatch.index;
                  const url = subMatch.groups.linkURL;
                  listChildren.push(React.createElement(url.match(/^(http|www.)/g) ? "a" : Link, {to: `/articles/${url}`, href: url}, subMatch.groups.linkText.replace("_", " ")));
                  break;

                }

                default:
                  break;

              }

              subMatchIndex += subMatch.groups.link.length;

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

          matchType = matchType === "link" ? Link : matchType;

          // Create the element and add it to the header list, if necessary
          const isHeader = headerDictionary[matchType];
          const Element = React.createElement(matchType, {key: i, id: isHeader && matchText.replaceAll(" ", "_"), to: matchType === Link ? (`/articles/${match.groups.linkURL}`) : undefined}, matchText);
          if (Element.props.id) headers.push(Element);
          currentDiv.push(Element);

          if (isHeader) {

            componentsToFormat.push(React.createElement(isHeader ? React.Fragment : "ul", null, currentDiv));
            currentDiv = [];
            
          }

        }

      }

      // Format the components
      formattedContent = componentsToFormat.map(component => component);
      
      // Prepare contributors
      contributors = props.data.contributors && props.data.contributors.map((contributorName, index, contributorArray) => {

        return (<>
          <a href={"/collaborators/" + contributorName}>{contributorName}</a>
          <span>{(index + 1 === contributorArray.length ? "" : (index + 2 === contributorArray.length ? (contributorArray.length === 2 ? "" : ",") + " and " : ""))}</span>
        </>);

      }) || "The Showrunners Team";

    }

    this.state = {
      content: formattedContent,
      contributors: contributors,
      headers: headers
    };

  }

  CloseSearchResults() {

    document.getElementById("search-results").classList.remove("block");

  }

  render() {

    return (
      <main id="article-container" onClick={this.CloseSearchResults}>
        <article>
          <section id="article-header">
            <div id="controls">
              <button>{this.state.content ? "Edit" : "Create"}</button>
            </div>
            <div>
              <h1 id="article-header-name">{this.props.name}</h1>
              {this.state.content && (<><div id="article-header-contributors">by {this.state.contributors}</div></>)}
            </div>
          </section>

          {/* 
            <Outline headers={this.state.headers} /> 
          */}

          <section id="article-content">{this.state.content || <>This article doesn't exist... <i>but it always will in our hearts ♥</i></>}</section>

          {this.state.content && (<section id="article-footer">
            <div id="last-edited">Last edited on January 1, 2021</div>
          </section>)}
        </article>
      </main>
    );

  }

}

Article.propTypes = {
  name: PropTypes.string,
  data: PropTypes.object
};

export default Article;