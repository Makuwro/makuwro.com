import React from "react";

export default function ProfileAbout({owner, styles, isStory, isWorld}) {

  return (
    <section id={styles.about}>
      {
        owner.about || owner.description || (
          <p>We don't know a lot about {owner.title || owner.name || owner.displayName || owner.username}, but we're sure {isStory || isWorld ? "it's" : "they're"} really cool.</p>
        )
      }
    </section>
  );

}