import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Dropdown from "../../input/Dropdown";
import Checkbox from "../../input/Checkbox";
import TagInput from "../../input/TagInput";
import Optional from "../../Optional";
import ContentInput from "../../input/ContentInput";
import { useNavigate } from "react-router-dom";

export default function WorldCreator({currentUser, setPopupSettings, character}) {

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
  const [admins, setAdmins] = useState([]);
  const [mods, setMods] = useState([]);
  const [members, setMembers] = useState([]);
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
      title: "Create world",
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

        response = await fetch(`${process.env.RAZZLE_API_DEV}contents/worlds/${currentUser.username}/${character ? character.slug : slug}`, {
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
          <label htmlFor="name">World name</label>
          <p>This name will be the first thing people see on the page.</p>
          <input type="text" required onInput={(event) => setName(event.target.value)} value={name} />
        </section>
        <section>
          <input type="file" style={{display: "none"}} ref={avatarInput} onChange={({target}) => setAvatar(target.files[0])} accept="image/*" />
          <label>World avatar<Optional /></label>
          <p>This is the image that people see before clicking on your world. You can add more art later.</p>
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
          <p>This description is shown below your world's name on their page.</p>
          <textarea value={description} onInput={(event) => setDescription(event.target.value)}></textarea>
        </section>
      </section>
      <section>
        <h1>Organization</h1>
        <section>
          <label htmlFor="tags">Tags<Optional /></label>
          <p>You can use tags to sort your worlds and easily find them later. These will also help people find your world.</p>
          <TagInput onChange={(tags) => setTags(tags)}>
            {tags}
          </TagInput>
        </section>
        <section>
          <label>Folders<Optional /></label>
          <p>You can add your world to multiple folders.</p>
          <ContentInput type={1} content={folders} currentUser={currentUser} onChange={(folders) => setFolders(folders)} />
        </section>
        <section>
          <label>Characters<Optional /></label>
          <p>You can directly add your characters to this world.</p>
          <ContentInput type={2} content={worlds} currentUser={currentUser} onChange={(worlds) => setWorlds(worlds)} />
        </section>
      </section>
      <section>
        <h1>Sharing</h1>
        <section>
          <label htmlFor="url">World URL</label>
          <p>Only alphanumeric characters, underscores, hyphens, and periods are allowed.</p>
          <section className="input-with-prefix">
            <span onClick={() => {

              slugRef.current.focus();
              slugRef.current.setSelectionRange(0, 0);

            }}>{`makuwro.com/${currentUser.username}/worlds/`}</span>
            <input type="text" name="url" ref={slugRef} onChange={(event) => setSlug(event.target.value)} value={slug} placeholder={name.replaceAll(/[^a-zA-Z0-9_]/gm, "-")}/>
          </section>
        </section>
        <section>
          <label>Admins</label>
          <p>These users have the powers of a moderator, along with the ability to manage the moderators and the world's settings. <b>You do not need to add yourself.</b></p>
          <ContentInput
            currentUser={currentUser}
            content={admins} 
            onChange={(admins) => setAdmins(admins)}
            type={0} 
          />
        </section>
        <section>
          <label>Moderators</label>
          <p>These users have the powers of a member, along with the ability to manage the members and the wiki, and review content attachment requests. <b>You do not need to add admins.</b></p>
          <ContentInput
            currentUser={currentUser}
            content={mods} 
            onChange={(mods) => setMods(mods)}
            type={0} 
          />
        </section>
        <section>
          <label>Members</label>
          <p>These users can view all other members and edit the wiki. <b>You do not need to add moderators or admins.</b></p>
          <ContentInput
            currentUser={currentUser}
            content={members} 
            onChange={(members) => setMods(members)}
            type={0} 
          />
        </section>
        <section>
          <label>Who can view this world?</label>
          <Dropdown tabIndex="0" index={permissions.view} onChange={(permission) => setPermissions((permissions) => ({...permissions, view: permission}))}>
            <li>Everyone, including visitors who aren't logged in</li>
            <li>Registered Makuwro users</li>
            <li>My followers and world members</li>
            <li>My friends and world members</li>
            <li>World members</li>
          </Dropdown>
        </section>
        <section>
          <label>Who can comment on this world?</label>
          <Dropdown tabIndex="0" index={permissions.postComments - 1} onChange={(permission) => setPermissions((permissions) => ({...permissions, postComments: permission + 1}))}>
            <li>Registered Makuwro users</li>
            <li>My followers and world members</li>
            <li>My friends and world members</li>
            <li>World members</li>
          </Dropdown>
        </section>
        <section>
          <label>Who can view comments on this world?</label>
          <Dropdown tabIndex="0" index={permissions.viewComments} onChange={(permission) => setPermissions((permissions) => ({...permissions, viewComments: permission}))}>
            <li>Everyone, including visitors who aren't logged in</li>
            <li>Registered Makuwro users</li>
            <li>My followers and world members</li>
            <li>My friends and world members</li>
            <li>World members</li>
          </Dropdown>
        </section>
        <section>
          <label>World terms of use<Optional /></label>
          <p>This will be shown on your world's terms page. Your <a target="_blank" href={`/${currentUser.username}/terms`} rel="noreferrer">global terms of use</a> will be shown below this.</p>
          <textarea placeholder="All rights reserved. Do not use this world without my approval." value={terms} onInput={(event) => setTerms(event.target.value)} />
        </section>
        <section>
          <label>Content warning<Optional /></label>
          <p>This text will be shown to viewers before they view this world's profile. Content attached to this world <b>will not</b> inherit this content warning.</p>
          <textarea value={contentWarning} onInput={(event) => setContentWarning(event.target.value)} />
        </section>
      </section>
      <input type="submit" value="Create world" disabled={submitting} />
    </form>
  ) : null;

}

WorldCreator.propTypes = {
  currentUser: PropTypes.object,
  setPopupSettings: PropTypes.func
};