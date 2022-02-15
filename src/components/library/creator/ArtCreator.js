import React, { useEffect, useRef, useState } from "react";
import styles from "../../../styles/Library.module.css";
import Dropdown from "../../input/Dropdown";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import TagInput from "../../input/TagInput";
import UserInput from "../../input/UserInput";

export default function ArtCreator({currentUser, setPopupSettings, notify}) {

  // Refs
  const image = useRef();
  const url = useRef();

  // States
  const state = {
    art: useState()
  };
  const [description, setDescription] = useState("");
  const [creatorType, setCreatorType] = useState(0);
  const [collaborators, setCollaborators] = useState([]);
  const [tags, setTags] = useState([]);
  const [folders, setFolders] = useState([]);
  const [worlds, setWorlds] = useState([]);
  const [slug, setSlug] = useState("");
  const [permissions, setPermissions] = useState({
    viewWatermarked: 0,
    viewOriginal: 0,
    viewComments: 0,
    postComments: 1
  });
  const [ageRestriction, setAgeRestriction] = useState(0);
  const [contentWarning, setContentWarning] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    setPopupSettings({
      title: "Upload art",
      warnUnfinished: true
    });

    document.title = "Upload art to Makuwro";
    if (currentUser) {

      setReady(true);

    }

  }, [currentUser]);

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

          userIds[i] = collaborators[i].key;

        }

        // Set up form data
        formData = new FormData();
        formData.append("image", image.current.files[0]);
        formData.append("description", description);
        formData.append("collaborators", JSON.stringify(userIds));
        formData.append("tags", JSON.stringify(tags));
        formData.append("folders", JSON.stringify(folders));
        formData.append("worlds", JSON.stringify(worlds));
        formData.append("permissions", JSON.stringify(permissions));
        formData.append("ageRestrictionLevel", ageRestriction);
        formData.append("contentWarning", contentWarning);

        response = await fetch(`${process.env.RAZZLE_API_DEV}contents/art/${currentUser.username}/${slug}`, {
          headers: {
            token: currentUser.token
          },
          body: formData,
          method: "POST"
        });

        if (response.ok) {

          navigate(`/${currentUser.username}/art/${slug}`);

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
            <input required type="file" accept="image/*" style={{display: "none"}} ref={image} onChange={({target: {files: [file]}}) => state.art[1](URL.createObjectURL(file))} />
            {state.art[0] && (
              <img src={state.art[0]} />
            )}
            <button tabIndex="0" onClick={(event) => {

              event.preventDefault();
              image.current.click();

            }}>{state.art[0] ? "Re-s" : "S"}elect image</button>
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
            <UserInput currentUser={currentUser} onChange={(collaborators) => setCollaborators(collaborators)} notify={notify}>
              {collaborators}
            </UserInput>
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
          <label>Folders<span style={{
            color: "var(--night-text)",
            marginLeft: "0.5rem"
          }}>(optional)</span></label>
          <p>You can add your character to multiple folders.</p>
          <Dropdown options={folders} tabIndex="0" multiple onChange={(options) => setFolders(options)}>

          </Dropdown>
        </section>
        <section>
          <label>Worlds<span style={{
            color: "var(--night-text)",
            marginLeft: "0.5rem"
          }}>(optional)</span></label>
          <p>You can directly add your character to worlds you manage here. To add your character to a world you don't manage, you have to create this character first, then submit a request to the world admins.</p>
          <Dropdown options={worlds} tabIndex="0" multiple onChange={(options) => setWorlds(options)}>

          </Dropdown>
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
          <Dropdown tabIndex="0" index={permissions.viewWatermarked} onChange={(choice) => setPermissions({...permissions, viewWatermarked: choice})}>
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
          <Dropdown tabIndex="0" index={ageRestriction} onChange={(choice) => setAgeRestriction(choice)}>
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
      <input disabled={submitting} tabIndex="0" type="submit" value="Upload art" />
    </form>
  );

}

ArtCreator.propTypes = {
  username: PropTypes.string,
  setPopupSettings: PropTypes.func,
  currentUser: PropTypes.object,
  notify: PropTypes.func,
  setLocation: PropTypes.func
};