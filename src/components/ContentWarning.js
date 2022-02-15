import React from "react";

export default function ContentWarning({children}) {

  return (
    <section>
      <section>
        {children}
      </section>
      <button>I understand</button>
      <button>Go back!</button>
    </section>
  );

}