import styles from "../../styles/ArtViewer.module.css";
import React, { useEffect, useState } from "react";
import Collaborator from "../Collaborator";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

const artRegex = /^\/(?<username>[^/]+)\/art\/(?<slug>[^/]+)\/?$/gm;

export default function ArtViewer({client}) {

  const [artInfo, setArtInfo] = useState();
  const [collaboratorComponents, setCollaboratorComponents] = useState([]);
  const [tagComponents, setTagComponents] = useState([]);
  const location = useLocation();

  useEffect(() => {

    // Check if we're looking for an art piece.
    if (artRegex.test(location.pathname)) {

      try {

        // Get art from the server.
        const art = {
          imagePath: "https://upload.wikimedia.org/wikipedia/commons/5/55/Smokestacks_of_Chemical_Plant_11-1972_%283703566787%29.jpg",
          description: "Aren't they a cutie? 🥰",
          owner: {
            username: "Christian",
            displayName: "Christian Toney",
            id: "6276f5c654cb1a7c52b5a7e2",
            avatarPath: "https://pbs.twimg.com/profile_images/1503878170642104320/hWzBPHQl_400x400.jpg"
          },
          uploadedOn: "May 14, 2022",
          tags: ["pollution", "your mom"]
        };
  
        // Iterate through each collaborator.
        const collaborators = [art.owner];
        for (let i = 0; collaborators.length > i; i++) {
  
          // Create a component for each collaborator.
          const {displayName, username, avatarPath, title} = collaborators[i];
          collaborators[i] = <Collaborator username={username} displayName={displayName} avatar={avatarPath} title={title} />
  
        }
  
        // Now iterate through each tag.
        const {tags} = art;
        for (let i = 0; tags.length > i; i++) {
  
          tags[i] = <span>{tags[i]}</span>;
  
        }
  
        // Set the new tag components.
        setTagComponents(tags);
  
        // Set the new collaborator components.
        setCollaboratorComponents(collaborators);
  
        // We're ready to show what we got!
        setArtInfo(art);
  
      } catch (err) {
  
  
  
      }

    }

  }, [location]);

  return artInfo ? (
    <section id={styles.viewer}>
      <section id={styles.imageContainer}>
        <img src={artInfo.imagePath} />
      </section>
      <section id={styles.details}>
        <section id={styles.collaborators}>
          {collaboratorComponents}
          {
            collaboratorComponents[3] && (
              <button>View all collaborators</button>
            )
          }
        </section>
        <section id={styles.description}>
          {artInfo.description}
          <section id={styles.metadata}>
            <section id={styles.tags}>
              {tagComponents}
            </section>
            <section id={styles.date}>
              Uploaded on {artInfo.uploadedOn}
            </section>
          </section>
        </section>
        <section id={styles.actions}>
          {
            client.user?.id === artInfo.owner.id && (
              <button id={styles.edit}>Edit</button>
            )
          }
          <button id={styles.like}>Like</button>
          <button className="destructive" id={styles.report}>Report</button>
        </section>
        <section>
          Comments disabled
        </section>
      </section>
    </section>
  ) : null;

}

ArtViewer.propTypes = {
  client: PropTypes.object.isRequired
}