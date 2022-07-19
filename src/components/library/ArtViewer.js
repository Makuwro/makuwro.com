import styles from "../../styles/ArtViewer.module.css";
import React, { useEffect, useState } from "react";
import Collaborator from "../Collaborator";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import Popup from "../popups/Popup";
import { UnderageError } from "makuwro-errors";

export default function ArtViewer({client}) {

  const [art, setArt] = useState();
  const [ageRestricted, setAgeRestricted] = useState(false);
  const [contentWarning, setContentWarning] = useState();
  const [collaboratorComponents, setCollaboratorComponents] = useState([]);
  const [tagComponents, setTagComponents] = useState([]);
  const {pathname} = useLocation();
  const [username, setUsername] = useState();

  useEffect(() => {

    (async () => {

      // Check if we're looking for an art piece.
      const artRegex = /^\/(?<username>[^/]+)\/art\/(?<slug>[^/]+)\/?$/gm;
      const [match] = [...pathname.matchAll(artRegex)];
      if (match) {

        try {

          // Get the owner username and slug.
          const {groups: {username, slug}} = match;
          setUsername(username);

          // Get art from the server.
          const art = await client.getArt(username, slug);
    
          // Iterate through each collaborator.
          const collaborators = [art.owner];
          for (let i = 0; collaborators.length > i; i++) {
    
            // Create a component for each collaborator.
            const {id, displayName, username, title} = collaborators[i];
            collaborators[i] = <Collaborator username={username} displayName={displayName} avatarPath={`${id}/avatar`} title={title} />
    
          }
    
          // Now iterate through each tag.
          const tags = art.tags || [];
          for (let i = 0; tags.length > i; i++) {
    
            tags[i] = <span>{tags[i]}</span>;
    
          }
    
          // Set the new tag components.
          setTagComponents(tags);
    
          // Set the new collaborator components.
          setCollaboratorComponents(collaborators);

          // Set the content warning.
          setContentWarning(art.contentWarning);
    
          // We're ready to show what we got!
          setArt(art);

          // Change the document title.
          document.title = `${art.owner.displayName} (${art.owner.username}): ${art.description || "Undescribed art"}`;
    
        } catch (err) {
    
          if (err instanceof UnderageError) {

            setAgeRestricted(true);

          } else {

            console.log(err);

          }
    
        }

      } else {

        setAgeRestricted(false);
        setArt();

      }

    })();

  }, [pathname]);

  const navigate = useNavigate();
  function closeWindow() {
    
    // Go back to the user's profile.
    navigate(`/${username}/art`);

  }

  async function deleteArt() {

    if (confirm("Are you sure you want to delete this art? No takesies-backsies!")) {

      try {

        // Delete the art.
        await art.delete();

        // Close the window.
        closeWindow();

      } catch (err) {

        alert(err);

      }
      

    }

  }

  if (art) {

    const isOwner = client.user?.id === art.owner.id;
    return (
      <section id={styles.viewer} onClick={closeWindow}>
        {contentWarning && (
          <Popup className={styles.warning} 
            title="Content warning"
            options={
              <>
                <button onClick={closeWindow}>Go back</button>
                <button className="destructive" onClick={() => setContentWarning()}>View anyway</button>
              </>
            }>
            {contentWarning}
            {art.ageRestrictionLevel > 0 && (
              <section className="info">This content may not be appropriate for all ages. Viewer discretion is advised.</section>
            )}
          </Popup>
        )}
        <section id={styles.imageContainer}>
          {!contentWarning && (
            <img 
              src={`https://cdn.makuwro.com/${art.imagePath}`} 
              onClick={(event) => event.stopPropagation()} />
          )}
        </section>
        <section id={styles.details} onClick={(event) => event.stopPropagation()}>
          <section id={styles.collaborators}>
            {collaboratorComponents}
            {
              collaboratorComponents[3] && (
                <button>View all collaborators</button>
              )
            }
          </section>
          <section id={styles.description}>
            {art.description}
            <section id={styles.metadata}>
              {tagComponents[0] && (
                <section id={styles.tags}>
                  {tagComponents}
                </section>
              )}
              <section id={styles.date}>
                Uploaded on {art.uploadedOn}
              </section>
            </section>
          </section>
          <section id={styles.actions}>
            <button id={styles.like}>Like</button>
            {
              isOwner ? (
                <>
                  <button id={styles.edit}>Edit</button>
                  <button className="destructive" id={styles.delete} onClick={deleteArt}>Delete</button>
                </>
              ) : (
                <button className="destructive" id={styles.report}>Report</button>
              )
            }
          </section>
          <section>
            Comments disabled
          </section>
        </section>
      </section>
    );

  } else if (ageRestricted) {

    return (
      <Popup 
        title="Age restricted"
        options={
          <button onClick={close}>Go back</button>
        }>
        You are not old enough to view this content.
      </Popup>
    );

  }

  return null;

}

ArtViewer.propTypes = {
  client: PropTypes.object.isRequired
}