import "../styles/global.css";
import Article from "./articles/[internalName]";
import Header from "./header";
import router from "next/router";
import Head from "next/head";
import { useState, React, useEffect } from "react";
import PropTypes from "prop-types";

const wikiServer = process.env.NEXT_PUBLIC_WIKI_SERVER;
const pageContentCache = {};

function App({ Component, pageProps }) {

  const [articleName, setArticleName] = useState();
  const [pageType, setPageType] = useState();
  const [internalName, setInternalName] = useState();

  function PreparePage(props) {
    
    // Make sure we're using underscores instead of spaces
    setInternalName(internalName);
    const underscoreInternalName = internalName.replaceAll(" ", "_");
    if (internalName !== underscoreInternalName) {

      return router.push(`/articles/${underscoreInternalName}`);

    }

    // Show the article name
    const displayName = underscoreInternalName.replaceAll("_", " ");
    setArticleName(displayName);
    document.title = displayName + " - The Showrunners Wiki";

    // Set page type to article
    setPageType(props.type);
    return null;

  }

  PreparePage.propTypes = {
    type: PropTypes.string
  };

  useEffect(async () => {

    try {

      switch (pageType) {

        case "category":
        case "article": {

          // Get the cookie
          const value = `; ${document.cookie}`;
          const parts = value.split("; access_token=");
          const token = parts.length === 2 && parts.pop().split(";")[0];

          // Check if we ran into any problems
          const cachedJson = pageContentCache[pageType + internalName];
          const pageResponse = cachedJson ? {status: 200} : await fetch(wikiServer + "/api/contents/" + (pageType === "article" ? "articles/" + internalName + ".md" : "categories.json"), {
            headers: {
              token: token
            }
          });
          const articleJson = cachedJson || (pageResponse.ok ? await pageResponse.json() : {});

          switch (pageResponse.status) {

            case 401:
              return router.push(`/login?redirect=/articles/${internalName}`);

            case 404:
            case 200: {
            
              // Save the content to lower the chance we get rate-limited
              pageContentCache[pageType + internalName] = articleJson;

              // Prepare category page, if necessary
              const allCategories = pageType === "category" && JSON.parse(articleJson.content);
              const category = allCategories && allCategories[articleName];
              articleJson.content = allCategories ? (category ? `Below are articles in the "${articleName}" category:\n` : "") : articleJson.content;
              if (category) {

                for (const [articleName, inCategory] of Object.entries(category)) {

                  articleJson.content = articleJson.content + (inCategory ? `* [${articleName}](${articleName})\n` : "");

                }

              }

              setPage(<>
                <Header />
                <Article name={articleName} data={articleJson} />
              </>);
              break;
              
            }

            default:
              break;

          }
          break;

        }

        case "callback": {

          

          break;

        }

        default:
          break;

      }

    } catch (err) {

      return router.push("/login");

    }

  }, [articleName, pageType]);

  return (
    <>
      <Head>
        <meta charset="utf-8" />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
        <link href="https://fonts.googleapis.com/css?family=Lexend+Deca" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" />
        <title>The Showrunners Wiki</title>
      </Head>
      <Component {...pageProps} />
    </>);

}

export default App;
