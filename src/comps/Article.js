import React from "react";
import "../styles/article.css";
import Outline from "./Outline.js";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const markupRegex = /\n*(?<li>\* (?<licontent>[^\n]+))|(# (?<h1>.+))|(## (?<h2>.+))|(### (?<h3>.+))|(?<element><(\w+?)( (?<elementAttribs>\w+=".+?|")|)>(?<elementText>.+?)<\/\w+?>)|(?<b>\*\*(?<bContent>[^*]+)\*\*)|(?<i>\*(?<iContent>[^*]+)\*)|{{((?<template>\S+)}})|\n+(?<div>[^#\n]+)|(?<link>\[\[(?<linkContent>[^\]]+)\]\])/gm;

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
      for (let i = 0; matches.length > i; i++) {

        // Get the match
        const match = matches[i];
        let matchType = Object.keys(match.groups).filter(key => match.groups[key])[0];
        let matchText = match.groups[matchType];
 
        // Check if it's a new line
        switch (matchType) {

          case "li":
          case "div":

            // Get the matches inside the new line
            matchText = (match.groups.licontent !== undefined ? match.groups.licontent : matchText).split(markupRegex);
            for (let x = 0; matchText.length > x; x++) {

              if (matchText[x]) {

                const subMatch = [...matchText[x].matchAll(markupRegex)][0];
                if (subMatch) {
                  
                  const subMatchType = Object.keys(subMatch.groups).filter(key => subMatch.groups[key])[0];
                  const subMatchText = matchText[x];
                  matchText.splice(x, 1);

                  switch (subMatchType) {

                    case "link":
                      matchText[x] = <Link to={`/articles/${subMatch.groups.linkContent}`}>{subMatch.groups.linkContent.replaceAll("_", " ")}</Link>;
                      break;

                    case "div": {

                      const childSubArray = subMatchText.split();

                      for (let a = 0; childSubArray.length > a; a++) {

                        const childSubMatchText = childSubArray[a];
                        const childSubMatch = [...childSubMatchText.matchAll(markupRegex)][0];
                        if (childSubMatch) {

                          const childSubMatchType = Object.keys(childSubMatch.groups).filter(key => childSubMatch.groups[key])[0];
                          childSubArray.splice(a, 1);

                          switch (childSubMatchType) {

                            case "link":
                              childSubArray[a] = <Link to={`/articles/${childSubMatchText}`}>{childSubMatchText}</Link>;
                              break;

                            default:
                              childSubArray[a] = React.createElement(childSubMatchType, {}, childSubMatchText);
                              break;

                          }

                        }

                      }

                      matchText[x] = <>{childSubArray}</>;
                      break;

                    }

                    default:
                      matchText[x] = React.createElement(subMatchType, null, {b: 1, i: 1}[subMatchType] ? subMatch.groups[subMatchType + "Content"] : subMatchText);
                      break;

                  }
                  
                }

              }

            }
            break;

          default:
            break;

        }

        // Create the element and add it to the header list, if necessary
        const Element = React.createElement(matchType, {key: i, id: {"h1": 1, "h2": 1, "h3": 1, "h4": 1, "h5": 1, "h6": 1}[matchType] && matchText.replaceAll(" ", "_")}, matchText);
        if (Element.props.id) headers.push(Element);

        // Add the component to the list
        componentsToFormat.push(Element);

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

  render() {

    return (
      <main id="article-container">
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

          <section id="article-content">{this.state.content || <>This article doesn't exist... <i>but it always will in our hearts ♥</i></>}</section>

          {this.state.content && (<section id="article-footer">
            <div id="last-edited">Last edited on January 1, 2021</div>
          </section>)}
        </article>

        <Outline headers={this.state.headers} />
      </main>
    );

  }

}

Article.propTypes = {
  name: PropTypes.string,
  data: PropTypes.object
};

export default Article;