import React, { useEffect, useState } from "react";
import sanitize from "sanitize-html";
import parse from "html-react-parser";
import { Link } from "react-router-dom";

export default function ProfileAbout({profileInfo, currentUser}) {

  const [ready, setReady] = useState();
  const [comp, setComp] = useState();

  useEffect(() => {

    if (profileInfo) {

      if (profileInfo.about) {

        // Protect us from bad HTML, please!
        const sanitizedHtml = sanitize(profileInfo.about, {allowedAttributes: false, allowedClasses: false});

        // Now convert the HTML into a React component!
        const comp = parse(sanitizedHtml, {

          replace: (element) => {
            
            // Check if the link is an internal link (makuwro.com)
            if (element.name === "a" && element.attribs.href === "https://makuwro.com") {

              // Replace the element with a React Router link so that the page doesn't refresh
              return <Link to=""></Link>;

            };

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
      <section>
        We don't know a lot about {profileInfo.username}, but I'm sure they're really cool.
      </section>
    )
  ) : null;

}