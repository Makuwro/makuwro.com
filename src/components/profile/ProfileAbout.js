import React from "react";

export default function ProfileAbout({owner, styles}) {

  return (
    <section id={styles.about}>
      {owner.about || owner.description || <p>We don't know a lot about {owner.name || owner.displayName || owner.username}, but we're sure they're really cool.</p>}
    </section>
  );

}