import React, { useRef } from "react";
import PropTypes from "prop-types";

export default function SlugInput({username, slug, onChange, placeholder, path, required, ...props}) {

  const slugRef = useRef();

  return (
    <section className="input-with-prefix" {...props}>
      <span onClick={() => {

        slugRef.current.focus();
        slugRef.current.setSelectionRange(0, 0);

      }}>{`makuwro.com/${username}/${path}/`}</span>
      <input type="text" name="url" ref={slugRef} onChange={(event) => onChange(event.target.value)} value={slug} placeholder={placeholder} required={required} />
    </section>
  );

}

SlugInput.propTypes = {
  username: PropTypes.string.isRequired,
  slug: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  path: PropTypes.string.isRequired
};