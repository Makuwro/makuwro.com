import React, { useEffect, useRef, useState } from "react";
import Dropdown from "../../input/Dropdown";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import TagInput from "../../input/TagInput";
import ContentInput from "../../input/ContentInput";
import Optional from "../../Optional";
import Checkbox from "../../input/Checkbox";

export default function LiteratureCreator({currentUser, setPopupSettings, notify}) {

  // Refs
  const image = useRef();
  const url = useRef();

  // States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editors, setEditors] = useState([]);
  const [reviewers, setReviewers] = useState([]);
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
  const [literatureType, setLiteratureType] = useState(0);
  const [wip, setWIP] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    if (currentUser) {

      setPopupSettings({
        title: "Create literature",
        warnUnfinished: true
      });
  
      document.title = "Create literature on Makuwro";

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
        let editorIds;
        let worldIds;
        let characterIds;
        let folderIds;
        const slug = slug || name.toLowerCase().replaceAll(/[^a-zA-Z0-9_]/gm, "-");

        // Turn the collaborators array into an array of user IDs
        editorIds = [];
        for (i = 0; editors.length > i; i++) {

          editorIds[i] = editors[i].id;

        }

        worldIds = [];
        for (i = 0; worlds.length > i; i++) {

          worldIds[i] = worlds[i].id;

        }

        characterIds = [];
        for (i = 0; characters.length > i; i++) {

          characterIds[i] = characters[i].id;

        }

        folderIds = [];
        for (i = 0; folders.length > i; i++) {

          folderIds[i] = folders[i].id;

        }

        // Set up form data
        formData = new FormData();
        formData.append("banner", image.current.files[0]);
        formData.append("description", description);
        formData.append("editors", JSON.stringify(editorIds));
        formData.append("tags", JSON.stringify(tags));
        formData.append("folders", JSON.stringify(folderIds));
        formData.append("worlds", JSON.stringify(worldIds));
        formData.append("references", JSON.stringify({
          worlds: worldIds,
          folders: folderIds,
          characters: characterIds
        }));
        formData.append("permissions", JSON.stringify(permissions));
        formData.append("ageRestrictionBLevel", ageRestrictionLevel);
        formData.append("contentWarning", contentWarning);
        formData.append("type", literatureType);
        formData.append("wip", wip);
        formData.append("slug", slug);

        response = await fetch(`${process.env.RAZZLE_API_DEV}contents/literature/${currentUser.username}/${slug}`, {
          headers: {
            token: currentUser.token
          },
          body: formData,
          method: "POST"
        });

        if (response.ok) {

          navigate(`/${currentUser.username}/literature/${slug}`);

        } else {

          throw new Error(await response.json());

        }

      } catch (err) {

        alert(`Couldn't create literature: ${err.message}`);
        setSubmitting(false);

      }

    }

  }

  return ready && currentUser && (
    <form onSubmit={submitForm}>
      <section>
        <section>
          <label>Literature name</label>
          <input type="text" value={name} onInput={(target) => setName(target.input.value)} />
        </section>
        <section>
          <label>Description<span style={{
            color: "var(--night-text)",
            marginLeft: "0.5rem"
          }}>(optional)</span></label>
          <textarea tabIndex="0" value={description} onInput={(event) => setDescription(event.target.value)}></textarea>
        </section>
        <section>
          <label>Literature type</label>
          <Dropdown index={literatureType} onChange={(type) => setLiteratureType(type)}>
            <li>One-off</li>
            <li>Multi-chapter</li>
          </Dropdown>
          <Checkbox checked={wip} onClick={(checked) => setWIP(checked)}>
            This literature is a work-in-progress
          </Checkbox>
        </section>
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
          <p>You can directly add your literature to worlds you manage here. To add your character to a world you don't manage, you have to create this character first, then submit a request to the world admins.</p>
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
          <label htmlFor="url">Literature URL</label>
          <p>Only alphanumeric characters, underscores, hyphens, and periods are allowed.</p>
          <section className="input-with-prefix">
            <span onClick={() => {

              url.current.focus();
              url.current.setSelectionRange(0, 0);

            }}>{`makuwro.com/${currentUser.username}/literature/`}</span>
            <input required tabIndex="0" type="text" name="url" ref={url} onInput={(event) => setSlug(event.target.value)} value={slug} placeholder={name.replaceAll(/[^a-zA-Z0-9_]/gm, "-")} />
          </section>
        </section>
        <section>
          <label>Editors</label>
          <p>These people will have access to view reviewer comments and edit your work. They are not able to publish, unpublish, or delete this literature.</p>
          {currentUser.isTeam && <p>Admins of {currentUser.displayName} are already able to edit and <i>can</i> delete this literature.</p>}
          <ContentInput
            currentUser={currentUser}
            content={editors}
            onChange={(editors) => setEditors(editors)} />
        </section>
        <section>
          <label>Reviewers</label>
          <p>These people will have access to read your unpublished work and make private comments.</p>
          <ContentInput
            currentUser={currentUser}
            content={reviewers}
            onChange={(reviewers) => setReviewers(reviewers)} />
        </section>
        <section>
          <label>Who can view this literature?</label>
          <Dropdown tabIndex="0" index={permissions.view} onChange={(choice) => setPermissions({...permissions, view: choice})}>
            <li>Everyone, including visitors who aren't logged in</li>
            <li>Registered Makuwro users</li>
            <li>My followers, editors, and reviewers</li>
            <li>My friends, editors, and reviewers</li>
            <li>Editors and reviewers</li>
          </Dropdown>
        </section>
        <section>
          <label>Who can view comments on this literature?</label>
          <Dropdown tabIndex="0" index={permissions.viewComments} onChange={(choice) => setPermissions({...permissions, viewComments: choice})}>
            <li>Everyone, including visitors who aren't logged in</li>
            <li>Registered Makuwro users</li>
            <li>My followers, editors, and reviewers</li>
            <li>My friends, editors, and reviewers</li>
            <li>Editors and reviewers</li>
          </Dropdown>
        </section>
        <section>
          <label>Who can comment on this literature?</label>
          <Dropdown tabIndex="0" index={permissions.postComments - 1} onChange={(choice) => setPermissions({...permissions, postComments: choice + 1})}>
            <li>Registered Makuwro users</li>
            <li>My followers</li>
            <li>My friends</li>
            <li>Just me</li>
          </Dropdown>
        </section>
        <section>
          <label>Would you like to age-restrict this literature?</label>
          <p>If so, users must sign in to view this literature. If you inappropriately age-gate your literature, Makuwro staff might enforce this setting.</p>
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
          <p>This text will be shown to viewers before they view this literature.</p>
          <textarea tabIndex="0" value={contentWarning} onInput={(event) => setContentWarning(event.target.value)}></textarea>
        </section>
      </section>
      <input disabled={submitting} tabIndex="0" type="submit" value="Create literature" />
    </form>
  );

}

LiteratureCreator.propTypes = {
  setPopupSettings: PropTypes.func,
  currentUser: PropTypes.object,
  notify: PropTypes.func
};