import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Dropdown from "../../input/Dropdown";
import TagInput from "../../input/TagInput";
import Optional from "../../Optional";
import ContentInput from "../../input/ContentInput";
import SlugInput from "../../input/SlugInput";
import Popup from "../../Popup";

export default function CharacterSubmitter({client, submitting, data, setData, setPermissions, submitForm}) {

  const [creatorType, setCreatorType] = useState(0);
  const [warnUnfinished, setWarnUnfinished] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const avatarInput = useRef();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    if (action === "create-character") {

      setPopupOpen(true);
      setMounted(true);

    } else {

      setPopupOpen(false);

    }

  }, [action]);

  return mounted ? (
    <Popup 
      title="Create character"
      warnUnfinished={warnUnfinished}
      options={
        <button 
          disabled={submitting || !data.name} 
          onClick={submitForm}>
          Create character
        </button>
      }
      open={popupOpen}
      onClose={() => setMounted(false) || navigate(location.pathname)}>
        <form onSubmit={submitForm}>
          <section>
            <h1>Basics</h1>
            <section>
              <label htmlFor="name">Character name</label>
              <p>This name will be the first thing people see on the page.</p>
              <input type="text" required onInput={(event) => setData("name", event.target.value)} value={data.name} />
            </section>
            <section>
              <input type="file" style={{display: "none"}} ref={avatarInput} onChange={({target}) => setData("image", target.files[0])} accept="image/*" />
              <label>Character avatar<Optional /></label>
              <p>This is the image that people see before clicking on your character. You can add more art later.</p>
              {data.image && (
                <img style={{marginTop: "1rem"}} src={URL.createObjectURL(data.image)} className="avatar-preview" />
              )}
              <section style={{marginTop: "1rem"}}>
                <input type="button" value="Change avatar" onClick={() => avatarInput.current.click()} />
                <input type="button" className="destructive" value="Remove avatar" style={{marginLeft: "10px"}} onClick={() => setData("image")} disabled={!data.image} />
              </section>
            </section>
            <section>
              <label>Description<Optional /></label>
              <p>This description is shown below your character's name on their page.</p>
              <textarea value={data.description} onInput={(event) => setData("description", event.target.value)}></textarea>
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
                <ContentInput 
                  type={0} 
                  content={data.collaborators} 
                  client={client} 
                  onChange={(collaborators) => setData("collaborators", collaborators)} 
                />
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
              <TagInput onChange={(tags) => setData("tags", tags)} tags={data.tags} />
            </section>
            <section>
              <label>Folders<Optional /></label>
              <p>You can add your character to multiple folders.</p>
              <ContentInput type={1} content={data.folders} client={client} onChange={(folders) => setData("folders", folders)} />
            </section>
            <section>
              <label>Worlds<Optional /></label>
              <p>You can directly add your character to worlds you manage here. To add your character to a world that you don't manage, you have to create this character first, then submit a request to the world admins.</p>
              <ContentInput type={2} content={data.worlds} client={client} onChange={(worlds) => setData("worlds", worlds)} />
            </section>
          </section>
          <section>
            <h1>Sharing</h1>
            <section>
              <label htmlFor="url">Character URL</label>
              <p>Only alphanumeric characters, underscores, hyphens, and periods are allowed.</p>
              <SlugInput 
                username={client.user.username}
                slug={data.slug}
                onChange={(slug) => setData("slug", slug)}
                placeholder={data.name.replaceAll(/[^a-zA-Z0-9_-]/gm, "-").toLowerCase()} 
                path="characters"
              />
            </section>
            <section>
              <label>Who can view this character?</label>
              <Dropdown tabIndex="0" index={data.permissions.view} onChange={(permission) => setPermissions("view", permission)}>
                <li>Everyone, including visitors who aren't logged in</li>
                <li>Registered Makuwro users</li>
                <li>My followers</li>
                <li>My friends</li>
                <li>Just me</li>
              </Dropdown>
            </section>
            <section>
              <label>Who can comment on this character?</label>
              <Dropdown tabIndex="0" index={data.permissions.postComments - 1} onChange={(permission) => setPermissions("postComments", permission + 1)}>
                <li>Registered Makuwro users</li>
                <li>My followers</li>
                <li>My friends</li>
                <li>Just me</li>
              </Dropdown>
            </section>
            <section>
              <label>Who can view comments on this character?</label>
              <Dropdown tabIndex="0" index={data.permissions.viewComments} onChange={(permission) => setPermissions("viewComments", permission + 1)}>
                <li>Everyone, including visitors who aren't logged in</li>
                <li>Registered Makuwro users</li>
                <li>My followers</li>
                <li>My friends</li>
                <li>Just me</li>
              </Dropdown>
            </section>
            <section>
              <label>Character terms of use<Optional /></label>
              <p>This will be shown on your character's page. Your <a target="_blank" href={`/${client.user.username}/terms`} rel="noreferrer">global terms of use</a> will be shown below this.</p>
              <textarea 
                placeholder="All rights reserved. Do not use this character without my approval." 
                value={data.terms} 
                onInput={(event) => setData("terms", event.target.value)} 
              />
            </section>
            <section>
              <label>Content warning<Optional /></label>
              <p>This text will be shown to viewers before they view this character's profile. Content attached to this character <b>will not</b> inherit this content warning.</p>
              <textarea 
                value={data.contentWarning} 
                onInput={(event) => setData("contentWarning", event.target.value)} 
              />
            </section>
          </section>
        </form>
    </Popup>
  ) : null;

}

CharacterSubmitter.propTypes = {
  data: PropTypes.object,
  client: PropTypes.object.isRequired,
  submitting: PropTypes.bool,
  setData: PropTypes.func,
  setPermissions: PropTypes.func
};