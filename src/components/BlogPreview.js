import React from "react";
import PropTypes from "prop-types";

export default function BlogPreview({owner, content, coverURL}) {

  return (
    <section>

    </section>
  );

}

BlogPreview.propTypes = {
  owner: PropTypes.object.isRequired,
  content: PropTypes.string,
  coverURL: PropTypes.string
};