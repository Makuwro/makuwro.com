import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Dropdown from "../../input/Dropdown";
import Checkbox from "../../input/Checkbox";
import TagInput from "../../input/TagInput";
import Optional from "../../Optional";
import ContentInput from "../../input/ContentInput";
import { useNavigate } from "react-router-dom";

export default function CharacterCreator({currentUser, setPopupSettings, character}) {

  const [ready, setReady] = useState(false);
  const [tags, setTags] = useState([]);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState("");
  const [terms, setTerms] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [contentWarning, setContentWarning] = useState("");
  const [folders, setFolders] = useState([]);
  const [worlds, setWorlds] = useState([]);
  const [ageRestrictionLevel, setAgeRestrictionLevel] = useState(0);
  const [collaborators, setCollaborators] = useState([]);
  const [creatorType, setCreatorType] = useState(0);
  const [permissions, setPermissions] = useState({
    view: 0,
    viewOriginal: 0,
    viewComments: 0,
    postComments: 1
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const avatarInput = useRef();
  const slugRef = useRef();

  useEffect(() => {

    setPopupSettings({
      title: "Create character",
      warnUnfinished: true
    });

    setReady(true);

  }, []);

  async function createCharacter(event) {

    event.preventDefault();

    if (!submitting) {

      setSubmitting(true);
      
      const slug = slug || name.toLowerCase().replaceAll(name.replaceAll(/[^a-zA-Z0-9_]/gm, "-"));

      try {

        let form;
        let response;

        // Package the form data.
        form = new FormData();
        form.append("name", name);
        form.append("avatar", avatar);
        form.append("description", description);
        form.append("tags", JSON.stringify(tags));
        form.append("folders", JSON.stringify(folders));
        form.append("worlds", JSON.stringify(worlds));
        form.append("permissions", JSON.stringify(permissions));
        form.append("ageRestrictionLevel", ageRestrictionLevel);
        form.append("contentWarning", contentWarning);
        form.append("slug", slug);

        response = await fetch(`${process.env.RAZZLE_API_DEV}contents/characters/${currentUser.username}/${character ? character.slug : slug}`, {
          headers: {
            token: currentUser.token
          },
          body: form,
          method: character ? "PATCH" : "POST"
        });

        if (response.ok) {

          navigate(`/${currentUser.username}/characters/${slug}`);

        } else {

          const {message} = await response.json();
          throw new Error(message);

        }

      } catch (err) {

        alert(`Couldn't upload your character: ${err.message}`);
        setSubmitting(false);

      }

    }

  }

  return ready ? (
    <form onSubmit={createCharacter}>
      <section>
        <h1>Basics</h1>
        <section>
          <label htmlFor="name">Character name</label>
          <p>This name will be the first thing people see on the page.</p>
          <input type="text" required onInput={(event) => setName(event.target.value)} value={name} />
        </section>
        <section>
          <input type="file" style={{display: "none"}} ref={avatarInput} onChange={({target}) => setAvatar(target.files[0])} accept="image/*" />
          <label>Character avatar<Optional /></label>
          <p>This is the image that people see before clicking on your character. You can add more art later.</p>
          {avatar && (
            <img style={{marginTop: "1rem"}} src={URL.createObjectURL(avatar)} className="avatar-preview" />
          )}
          <section style={{marginTop: "1rem"}}>
            <input type="button" value="Change avatar" onClick={() => avatarInput.current.click()} />
            <input type="button" className="destructive" value="Remove avatar" style={{marginLeft: "10px"}} onClick={() => setAvatar()} disabled={!avatar} />
          </section>
        </section>
        <section>
          <label>Description<Optional /></label>
          <p>This description is shown below your character's name on their page.</p>
          <textarea value={description} onInput={(event) => setDescription(event.target.value)}></textarea>
        </section>
        <section>
          <label>Who created this character?</label>
          <Dropdown index={creatorType} onChange={(index) => setCreatorType(index)}>
            <li>I am the sole creator of this character</li>
            <li>I collaborated with another on-site creator</li>
            <li>I collaborated with an off-site creator</li>
          </Dropdown>
        </section>
        {creatorType === 1 && (
          <section>
            <label>Who did you collaborate with?</label>
            <ContentInput type={0} content={collaborators} currentUser={currentUser} onChange={(collaborators) => setCollaborators(collaborators)} />
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
          <label htmlFor="tags">Tags<Optional /></label>
          <p>You can use tags to sort your characters and easily find them later. These will also help people find your characters.</p>
          <TagInput onChange={(tags) => setTags(tags)}>
            {tags}
          </TagInput>
        </section>
        <section>
          <label>Folders<Optional /></label>
          <p>You can add your character to multiple folders.</p>
          <ContentInput type={1} content={folders} currentUser={currentUser} onChange={(folders) => setFolders(folders)} />
        </section>
        <section>
          <label>Worlds<Optional /></label>
          <p>You can directly add your character to worlds you manage here. To add your character to a world that you don't manage, you have to create this character first, then submit a request to the world admins.</p>
          <ContentInput type={2} content={worlds} currentUser={currentUser} onChange={(worlds) => setWorlds(worlds)} />
        </section>
      </section>
      <section>
        <h1>Sharing</h1>
        <section>
          <label htmlFor="url">Character URL</label>
          <p>Only alphanumeric characters, underscores, hyphens, and periods are allowed.</p>
          <section className="input-with-prefix">
            <span onClick={() => {

              slugRef.current.focus();
              slugRef.current.setSelectionRange(0, 0);

            }}>{`makuwro.com/${currentUser.username}/characters/`}</span>
            <input type="text" name="url" ref={slugRef} onChange={(event) => setSlug(event.target.value)} value={slug} placeholder={name.replaceAll(/[^a-zA-Z0-9_]/gm, "-")}/>
          </section>
        </section>
        <section>
          <label>Who can view this character?</label>
          <Dropdown tabIndex="0" index={permissions.view} onChange={(permission) => setPermissions((permissions) => ({...permissions, view: permission}))}>
            <li>Everyone, including visitors who aren't logged in</li>
            <li>Registered Makuwro users</li>
            <li>My followers</li>
            <li>My friends</li>
            <li>Just me</li>
          </Dropdown>
        </section>
        <section>
          <label>Who can comment on this character?</label>
          <Dropdown tabIndex="0" index={permissions.postComments - 1} onChange={(permission) => setPermissions((permissions) => ({...permissions, postComments: permission + 1}))}>
            <li>Registered Makuwro users</li>
            <li>My followers</li>
            <li>My friends</li>
            <li>Just me</li>
          </Dropdown>
        </section>
        <section>
          <label>Who can view comments on this character?</label>
          <Dropdown tabIndex="0" index={permissions.viewComments} onChange={(permission) => setPermissions((permissions) => ({...permissions, viewComments: permission}))}>
            <li>Everyone, including visitors who aren't logged in</li>
            <li>Registered Makuwro users</li>
            <li>My followers</li>
            <li>My friends</li>
            <li>Just me</li>
          </Dropdown>
        </section>
        <section>
          <label>Character terms of use<Optional /></label>
          <p>This will be shown on your character's page. Your <a target="_blank" href={`/${currentUser.username}/terms`} rel="noreferrer">global terms of use</a> will be shown below this.</p>
          <textarea placeholder="All rights reserved. Do not use this character without my approval." value={terms} onInput={(event) => setTerms(event.target.value)}>

          </textarea>
        </section>
        <section>
          <label>Content warning<Optional /></label>
          <p>This text will be shown to viewers before they view this character's profile. Content attached to this character <b>will not</b> inherit this content warning.</p>
          <textarea value={contentWarning} onInput={(event) => setContentWarning(event.target.value)}>

          </textarea>
        </section>
      </section>
      <input type="submit" value="Create character" disabled={submitting} />
    </form>
  ) : null;

}

CharacterCreator.propTypes = {
  currentUser: PropTypes.object,
  setPopupSettings: PropTypes.func
};