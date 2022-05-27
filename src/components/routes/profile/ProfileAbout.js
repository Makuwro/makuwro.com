import React, { useEffect, useState } from "react";
import sanitize from "sanitize-html";
import parse from "html-react-parser";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

export default function ProfileAbout({owner, isCharacter}) {

  const [ready, setReady] = useState();
  const [comp, setComp] = useState();
  const {pathname} = useLocation();

  useEffect(() => {

    if (owner) {

      const content = owner[isCharacter ? "description" : "about"];
      if (content) {

        // Protect us from bad HTML, please!
        const sanitizedHtml = sanitize(content, {
          allowedAttributes: false, 
          allowedClasses: false,
          allowedTags: [
            "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
            "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
            "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
            "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
            "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
            "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
            "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr",
            "audio", "source", "video", "iframe"
          ]
        });

        // Now convert the HTML into a React component!
        const comp = parse(sanitizedHtml, {

          replace: (element) => {
            
            // Check if the link is an internal link (makuwro.com)
            if (element.name === "a" && element.attribs.href === "https://makuwro.com") {

              // Replace the element with a React Router link so that the page doesn't refresh
              return <Link to=""></Link>;

            }

            return element;

          }

        });

        // Set the component, and we're done!
        setComp(comp);

      }

      setReady(true);

    }

  }, [owner]);

  useEffect(() => {

    if (pathname !== "/notifications" && pathname !== "/register" && pathname !== "/signin") {

      document.title = `${owner.username} on Makuwro`;

    }

  }, [pathname]);

  return ready ? (
    comp || (
      <p>We don't know a lot about {owner.displayName || owner.username}, but I'm sure they're really cool.</p>
    )
  ) : null;

}

ProfileAbout.propTypes = {
  owner: PropTypes.object,
  isCharacter: PropTypes.bool
};