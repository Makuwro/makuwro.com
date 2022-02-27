import React, { useEffect, useRef, useState } from "react";
import styles from "../../../styles/Library.module.css";
import Dropdown from "../../input/Dropdown";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import TagInput from "../../input/TagInput";
import ContentInput from "../../input/ContentInput";
import Optional from "../../Optional";

export default function ArtCreator({currentUser, setPopupSettings, notify, art, refreshArt, updated}) {

  // Refs
  const image = useRef();
  const url = useRef();

  // States
  const [imagePath, setImagePath] = useState(null);
  const [description, setDescription] = useState("");
  const [creatorType, setCreatorType] = useState(0);
  const [collaborators, setCollaborators] = useState([]);
  const [tags, setTags] = useState([]);
  const [folders, setFolders] = useState([]);
  const [worlds, setWorlds] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [slug, setSlug] = useState("");
  const [permissions, setPermissions] = useState({
    view: 0,
    viewOriginal: 0,
    viewComments: 0,
    postComments: 1
  });
  const [ageRestrictionLevel, setAgeRestrictionLevel] = useState(0);
  const [contentWarning, setContentWarning] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    if (art) {

      setImagePath(`https://cdn.makuwro.com/${art.imagePath}`);
      setDescription(art.description || description);
      setCollaborators(art.collaborators || collaborators);
      setTags(art.tags || tags);
      setCharacters(art.characters || characters);
      setFolders(art.folders || folders);
      setWorlds(art.worlds || worlds);
      setSlug(art.slug || slug);
      setAgeRestrictionLevel(art.ageRestrictionLevel || ageRestrictionLevel);
      setContentWarning(art.contentWarning || contentWarning);

      setPopupSettings({
        title: "Update art",
        warnUnfinished: true
      });

    } else {

      setPopupSettings({
        title: "Upload art",
        warnUnfinished: true
      });

    }

    document.title = "Upload art to Makuwro";

    if (currentUser) {

      setReady(true);

    }

  }, [currentUser, art]);

  async function submitForm(event) {

    event.preventDefault();
    if (!submitting) {
      
      setSubmitting(true);
      try {

        let formData;
        let response;
        let i;
        let userIds;

        // Turn the collaborators array into an array of user IDs
        userIds = [];
        for (i = 0; collaborators.length > i; i++) {

          userIds[i] = collaborators[i].id;

        }

        // Set up form data
        formData = new FormData();
        formData.append("image", image.current.files[0]);
        formData.append("description", description);
        formData.append("collaborators", JSON.stringify(userIds));
        formData.append("tags", JSON.stringify(tags));
        formData.append("folders", JSON.stringify(folders));
        formData.append("worlds", JSON.stringify(worlds));
        formData.append("characters", JSON.stringify(characters));
        formData.append("permissions", JSON.stringify(permissions));
        formData.append("ageRestrictionLevel", ageRestrictionLevel);
        formData.append("contentWarning", contentWarning);
        formData.append("slug", slug);

        response = await fetch(`${process.env.RAZZLE_API_DEV}contents/art/${currentUser.username}/${art ? art.slug : slug}`, {
          headers: {
            token: currentUser.token
          },
          body: formData,
          method: art ? "PATCH" : "POST"
        });

        if (response.ok) {

          navigate(`/${currentUser.username}/art/${slug}`);
          refreshArt();
          updated();

        } else {

          const {message} = await response.json();

          notify({
            title: "Couldn't submit your art",
            children: message
          });
          setSubmitting(false);

        }

      } catch (err) {

        notify({
          title: "Couldn't upload your art",
          children: "Unknown error"
        });
        setSubmitting(false);

      }

    }

  }

  return ready && currentUser && (
    <form id={styles["upload-art"]} onSubmit={submitForm}>
      <section>
        <h1>Basics</h1>
        <section id={styles.fileSelectBackground}>
          <section>
            <input required={!imagePath} type="file" accept="image/*" style={{display: "none"}} ref={image} onChange={({target: {files: [file]}}) => setImagePath(URL.createObjectURL(file))} />
            {imagePath && (
              <img src={imagePath} />
            )}
            <button tabIndex="0" onClick={(event) => {

              event.preventDefault();
              image.current.click();

            }}>{imagePath ? "Re-s" : "S"}elect image</button>
            <p>Please only upload content that you have permission to use.</p>
          </section>
        </section>
        <section>
          <label>Description<span style={{
            color: "var(--night-text)",
            marginLeft: "0.5rem"
          }}>(optional)</span></label>
          <textarea tabIndex="0" value={description} onInput={(event) => setDescription(event.target.value)}></textarea>
        </section>
        <section>
          <label>Who created this art?</label>
          <Dropdown tabIndex="0" index={creatorType} onChange={(choice) => setCreatorType(choice)}>
            <li>I am the sole artist</li>
            <li>I collaborated with another on-site artist</li>
            <li>I collaborated with an off-site artist</li>
          </Dropdown>
        </section>
        {creatorType === 1 && (
          <section>
            <label>Who did you collaborate with?</label>
            <ContentInput content={collaborators} type={0} currentUser={currentUser} onChange={(collaborators) => setCollaborators(collaborators)} notify={notify} />
          </section>
        )}
        {creatorType === 2 && (
          <section>
            <label>Who did you collaborate with?</label>
            <input tabIndex="0" type="text" required />
          </section>
        )}
      </section>
      <section>
        <h1>Organization</h1>
        <section>
          <label htmlFor="tags">Tags<span style={{
            color: "var(--night-text)",
            marginLeft: "0.5rem"
          }}>(optional)</span></label>
          <p>You can use tags to sort your characters and easily find them later.</p>
          <TagInput onChange={(tags) => setTags(tags)} notify={notify}>
            {tags}
          </TagInput>
        </section>
        <section>
          <label>Folders<Optional /></label>
          <p>You can add your character to multiple folders.</p>
          <ContentInput content={folders} type={1} currentUser={currentUser} onChange={(options) => setFolders(options)} />
        </section>
        <section>
          <label>Worlds<Optional /></label>
          <p>You can directly add your art to worlds you manage here. To add your character to a world you don't manage, you have to create this character first, then submit a request to the world admins.</p>
          <ContentInput content={worlds} type={2} currentUser={currentUser} onChange={(options) => setWorlds(options)} />
        </section>
        <section>
          <label>Characters<Optional /></label>
          <p>You can directly tag your characters.</p>
          <ContentInput content={characters} type={3} currentUser={currentUser} onChange={(characters) => setCharacters(characters)} />
        </section>
      </section>
      <section>
        <h1>Sharing</h1>
        <section>
          <label htmlFor="url">Art URL</label>
          <p>Only alphanumeric characters, underscores, hyphens, and periods are allowed.</p>
          <section className="input-with-prefix">
            <span onClick={() => {

              url.current.focus();
              url.current.setSelectionRange(0, 0);

            }}>{`makuwro.com/${currentUser.username}/art/`}</span>
            <input required tabIndex="0" type="text" name="url" ref={url} onInput={(event) => setSlug(event.target.value)} value={slug}/>
          </section>
        </section>
        <section>
          <label>Who can see the watermarked version of this image?</label>
          <Dropdown tabIndex="0" index={permissions.view} onChange={(choice) => setPermissions({...permissions, view: choice})}>
            <li>Everyone, including visitors who aren't logged in</li>
            <li>Registered Makuwro users</li>
            <li>My followers</li>
            <li>My friends</li>
            <li>Just me</li>
          </Dropdown>
        </section>
        <section>
          <label>Who can see the non-watermarked version of this image?</label>
          <Dropdown tabIndex="0" index={permissions.viewOriginal} onChange={(choice) => setPermissions({...permissions, viewOriginal: choice})}>
            <li>Everyone, including visitors who aren't logged in</li>
            <li>Registered Makuwro users</li>
            <li>My followers</li>
            <li>My friends</li>
            <li>Just me</li>
          </Dropdown>
        </section>
        <section>
          <label>Who can view comments on this image?</label>
          <Dropdown tabIndex="0" index={permissions.viewComments} onChange={(choice) => setPermissions({...permissions, viewComments: choice})}>
            <li>Everyone, including visitors who aren't logged in</li>
            <li>Registered Makuwro users</li>
            <li>My followers</li>
            <li>My friends</li>
            <li>Just me</li>
          </Dropdown>
        </section>
        <section>
          <label>Who can comment on this image?</label>
          <Dropdown tabIndex="0" index={permissions.postComments - 1} onChange={(choice) => setPermissions({...permissions, postComments: choice + 1})}>
            <li>Registered Makuwro users</li>
            <li>My followers</li>
            <li>My friends</li>
            <li>Just me</li>
          </Dropdown>
        </section>
        <section>
          <label>Would you like to age-restrict this image?</label>
          <p>If so, users must sign in to view this image. If you inappropriately age-gate your image, Makuwro staff might enforce this setting.</p>
          <Dropdown tabIndex="0" index={ageRestrictionLevel} onChange={(choice) => setAgeRestrictionLevel(choice)}>
            <li>No</li>
            <li>Yes, restrict users under 13 from viewing this</li>
            <li>Yes, restrict users under 17 from viewing this</li>
            <li>Yes, restrict users under 18 from viewing this</li>
          </Dropdown>
        </section>
        <section>
          <label>Content warning<span style={{
            color: "var(--night-text)",
            marginLeft: "0.5rem"
          }}>(optional)</span></label>
          <p>This text will be shown to viewers before they view this image.</p>
          <textarea tabIndex="0" value={contentWarning} onInput={(event) => setContentWarning(event.target.value)}></textarea>
        </section>
      </section>
      <input disabled={submitting} tabIndex="0" type="submit" value={art ? "Save" : "Upload art"} />
    </form>
  );

}

ArtCreator.propTypes = {
  username: PropTypes.string,
  setPopupSettings: PropTypes.func,
  currentUser: PropTypes.object,
  notify: PropTypes.func,
  setLocation: PropTypes.func,
  art: PropTypes.any
};