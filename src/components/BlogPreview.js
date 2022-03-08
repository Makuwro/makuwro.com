import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import profileStyles from "../styles/Profile.module.css";
import styles from "../styles/Blog.module.css";

export default function BlogPreview({
  owner, title, coverURL, slug, published, currentUserIsOwner
}) {

  const ownerPath = `/${owner.username}`;

  return (
    <Link to={`${ownerPath}/blog/${slug}`} draggable={false} className={profileStyles.blogPreview}>
      {coverURL && (
        <section>
          <img src={`https://cdn.makuwro.com/${owner.coverURL}`} />
        </section>
      )}
      <h1>
        {title || "Untitled blog"}
        {currentUserIsOwner && (
          <span>{published ? "PUBLIC" : "PRIVATE"}</span>
        )}
      </h1>
      <section className={styles.creator}>
        <img src={`https://cdn.makuwro.com/${owner.avatarPath}`} />
        <span>{owner.displayName || `@${owner.username}`}</span>
      </section>
    </Link>
  );

}

BlogPreview.propTypes = {
  owner: PropTypes.object.isRequired,
  content: PropTypes.string,
  coverURL: PropTypes.string
};