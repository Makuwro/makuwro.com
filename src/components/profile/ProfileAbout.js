import React, { useEffect, useState } from "react";
import sanitize from "sanitize-html";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function ProfileAbout({profileInfo}) {

  const [ready, setReady] = useState();
  const [comp, setComp] = useState();

  useEffect(() => {

    if (profileInfo) {

      if (profileInfo.about) {

        // Protect us from bad HTML, please!
        const sanitizedHtml = sanitize(profileInfo.about, {
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

  }, [profileInfo]);

  return ready ? (
    comp || (
      <p>We don't know a lot about {profileInfo.username || profileInfo.name}, but I'm sure they're really cool.</p>
    )
  ) : null;

}

ProfileAbout.propTypes = {
  profileInfo: PropTypes.object
};